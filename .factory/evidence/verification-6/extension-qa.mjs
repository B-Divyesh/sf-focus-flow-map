import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const profile = await mkdtemp(join(tmpdir(), 'ffm-verification-6-'));
const extensionPath = resolve('.output/chrome-mv3');
const context = await chromium.launchPersistentContext(profile, {
  channel: 'chromium',
  headless: true,
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
});

const evidence = { profile, errors: [], expectedDiagnostics: [], network: [], checks: {} };
context.on('request', (request) => evidence.network.push(request.url()));
const [initialWorker] = context.serviceWorkers();
const worker = initialWorker ?? await context.waitForEvent('serviceworker');
const page = await context.newPage();
page.on('console', (message) => {
  if (message.type() === 'error') evidence.errors.push(`page console: ${message.text()}`);
});
page.on('pageerror', (error) => evidence.errors.push(`page error: ${error.message}`));

await page.goto('https://focus-flow-map.sociobot.in/?demo=1&email=qa.private%40example.com&token=drop-me#private-fragment');
await page.waitForLoadState('networkidle');
await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
evidence.checks.beforeStart = {
  storage: await worker.evaluate(() => chrome.storage.local.get(null)),
  overlayCount: await page.locator('#focus-flow-map-recorder').count(),
};

const sendToTab = (type) => worker.evaluate(async (messageType) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('No active tab');
  return chrome.tabs.sendMessage(tab.id, { type: messageType });
}, type);

await sendToTab('START_RECORDING');
const overlayTargets = await page.locator('#focus-flow-map-recorder').evaluate((host) => (
  [...host.shadowRoot.querySelectorAll('button')].map((button) => {
    const rect = button.getBoundingClientRect();
    return { text: button.textContent.trim(), width: rect.width, height: rect.height };
  })
));
const emptyStop = await sendToTab('STOP_RECORDING');
const emptyStored = await worker.evaluate(() => chrome.storage.local.get('ffm_sessions'));
evidence.checks.emptyBoundary = { emptyStop, savedSteps: emptyStored.ffm_sessions?.[0]?.steps.length, overlayTargets };

await sendToTab('START_RECORDING');
await page.evaluate(() => {
  const label = document.createElement('label');
  label.htmlFor = 'qa-private-input';
  label.textContent = 'Account email';
  const input = document.createElement('input');
  input.id = 'qa-private-input';
  input.value = 'private-input-value';
  const next = document.createElement('button');
  next.id = 'qa-next';
  next.textContent = 'Next review step';
  const finish = document.createElement('button');
  finish.id = 'qa-finish';
  finish.textContent = 'Finish review';
  document.body.append(label, input, next, finish);
  input.focus();
});
await page.waitForTimeout(100);
await page.locator('#qa-next').focus();
await page.waitForTimeout(100);
await page.keyboard.press('Tab');
await page.waitForTimeout(100);
await page.keyboard.press('Shift+Tab');
await page.waitForTimeout(100);
const normalStop = await sendToTab('STOP_RECORDING');
const stored = await worker.evaluate(() => chrome.storage.local.get('ffm_sessions'));
const storedText = JSON.stringify(stored);
const session = stored.ffm_sessions[0];
evidence.checks.recording = {
  normalStop,
  stepCount: session.steps.length,
  directions: session.steps.map((step) => step.direction),
  fieldsComplete: session.steps.every((step, index) => (
    step.index === index + 1
    && typeof step.timestamp === 'number'
    && typeof step.selector === 'string'
    && typeof step.label === 'string'
    && typeof step.visible === 'boolean'
    && typeof step.focusIndicator === 'boolean'
    && typeof step.scrollDelta === 'number'
    && typeof step.rect?.x === 'number'
    && typeof step.viewport?.width === 'number'
  )),
  safeUrl: session.url,
  sensitiveAbsent: !storedText.includes('qa.private')
    && !storedText.includes('drop-me')
    && !storedText.includes('private-fragment')
    && !storedText.includes('private-input-value'),
};

const extensionId = new URL(worker.url()).host;
const dashboard = await context.newPage();
dashboard.on('console', (message) => {
  if (message.type() !== 'error') return;
  if (licenseMode === 'interrupted' && message.text().includes('ERR_CONNECTION_FAILED')) {
    evidence.expectedDiagnostics.push(`interrupted license request: ${message.text()}`);
  } else {
    evidence.errors.push(`dashboard console: ${message.text()}`);
  }
});
dashboard.on('pageerror', (error) => evidence.errors.push(`dashboard error: ${error.message}`));
let licenseMode = 'inactive';
let licenseRequests = 0;
await dashboard.route('https://api.sociobot.in/**', async (route) => {
  licenseRequests += 1;
  if (licenseMode === 'interrupted') return route.abort('connectionfailed');
  const valid = licenseMode === 'active';
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid, reason: valid ? 'ok' : 'invalid', expires_at: null }) });
});
await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
await dashboard.getByText('Have a license? Restore it').click();
const token = dashboard.locator('#license-token');
const verify = dashboard.getByRole('button', { name: 'Verify license' });
await verify.click();
const requiredInvalid = await token.evaluate((field) => !field.checkValidity());
const requestsAfterEmpty = licenseRequests;

await token.fill('fixture-inactive-license');
await verify.click();
await dashboard.locator('#license-state').waitFor({ state: 'visible' });
await dashboard.waitForFunction(() => document.querySelector('#license-state')?.textContent === 'License no longer active');
const inactiveState = await dashboard.locator('#license-state').textContent();

licenseMode = 'interrupted';
await token.fill('fixture-interrupted-license');
await verify.click();
await dashboard.waitForFunction(() => document.querySelector('#license-state')?.textContent?.startsWith('Could not verify'));
const interruptedState = await dashboard.locator('#license-state').textContent();

licenseMode = 'active';
await token.fill('fixture-active-license');
await verify.click();
await dashboard.waitForFunction(() => document.querySelector('#license-state')?.textContent === 'Pro active on this device');
const recoveredState = await dashboard.locator('#license-state').textContent();
evidence.checks.license = { requiredInvalid, requestsAfterEmpty, inactiveState, interruptedState, recoveredState, licenseRequests };

const [markdownDownload] = await Promise.all([
  dashboard.waitForEvent('download'),
  dashboard.getByRole('button', { name: 'Export Markdown' }).click(),
]);
const [jsonDownload] = await Promise.all([
  dashboard.waitForEvent('download'),
  dashboard.getByRole('button', { name: 'Export JSON' }).click(),
]);
const markdownPath = join(profile, 'verification.md');
const jsonPath = join(profile, 'verification.json');
await markdownDownload.saveAs(markdownPath);
await jsonDownload.saveAs(jsonPath);
const markdown = await readFile(markdownPath, 'utf8');
const json = await readFile(jsonPath, 'utf8');
evidence.checks.exports = {
  markdownBytes: Buffer.byteLength(markdown),
  jsonBytes: Buffer.byteLength(json),
  safeUrlPresent: markdown.includes(session.url) && json.includes(session.url),
  sensitiveAbsent: !`${markdown}\n${json}`.includes('qa.private')
    && !`${markdown}\n${json}`.includes('drop-me')
    && !`${markdown}\n${json}`.includes('private-input-value'),
};
await dashboard.screenshot({ path: '.factory/evidence/verification-6/extension-dashboard-route.png', fullPage: true });

await dashboard.getByRole('button', { name: 'Delete this session' }).click();
const dialogInitialFocus = await dashboard.locator('#delete-dialog').evaluate((dialog) => dialog.contains(document.activeElement));
await dashboard.keyboard.press('Escape');
const retainedAfterEscape = await dashboard.locator('#report').isVisible();
await dashboard.getByRole('button', { name: 'Delete this session' }).click();
await dashboard.getByRole('button', { name: 'Keep session' }).click();
const retainedAfterCancel = await dashboard.locator('#report').isVisible();
await dashboard.getByRole('button', { name: 'Delete this session' }).click();
await dashboard.getByRole('button', { name: 'Delete session', exact: true }).click();
const emptyAfterConfirm = await dashboard.locator('#empty-state').isVisible();
evidence.checks.deletion = { dialogInitialFocus, retainedAfterEscape, retainedAfterCancel, emptyAfterConfirm };

const dashboardAxe = await new AxeBuilder({ page: dashboard }).analyze();
await dashboard.screenshot({ path: '.factory/evidence/verification-6/extension-dashboard-desktop.png', fullPage: true });
await dashboard.setViewportSize({ width: 390, height: 844 });
const mobile = await dashboard.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > innerWidth,
  undersized: [...document.querySelectorAll('a[href],button,summary,input,select,textarea')].flatMap((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0 || (rect.width >= 44 && rect.height >= 44)
      ? [] : [{ name: (element.getAttribute('aria-label') || element.textContent || '').trim(), width: rect.width, height: rect.height }];
  }),
}));
evidence.checks.accessibility = {
  serious: dashboardAxe.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical').map((item) => item.id),
  mobile,
};
await dashboard.screenshot({ path: '.factory/evidence/verification-6/extension-dashboard-mobile.png', fullPage: true });

const billingNetwork = evidence.network.filter((url) => url.startsWith('https://api.sociobot.in/'));
const otherRemoteDuringRecording = evidence.network.filter((url) => (
  (url.startsWith('http://') || url.startsWith('https://'))
  && !url.startsWith('https://focus-flow-map.sociobot.in/')
  && !url.startsWith('https://api.sociobot.in/')
));
evidence.checks.network = { billingNetwork, otherRemoteDuringRecording };
const report = JSON.stringify(evidence, null, 2);
await writeFile('.factory/evidence/verification-6/extension-qa.json', `${report}\n`);
console.log(report);
await context.close();
