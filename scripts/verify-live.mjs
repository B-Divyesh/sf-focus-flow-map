import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const origin = (process.env.VERIFY_ORIGIN ?? 'https://focus-flow-map.sociobot.in').replace(/\/$/, '');
const evidenceDir = resolve(process.env.VERIFY_EVIDENCE_DIR ?? '.factory/evidence/polish-5-live');
await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch();
const report = { origin, checkedAt: new Date().toISOString(), routes: {}, links: [], mobile: {}, demoIsolation: {}, routeFocus: {}, offline: {}, headers: {} };

try {
  const expectedRoutes = [
    ['/', 200, 'Focus Flow Map — Map the keyboard focus route', 'Map where Tab goes.'],
    ['/?demo=1', 200, 'Demo — Focus Flow Map', 'Review a sample focus route.'],
    ['/privacy/', 200, 'Privacy — Focus Flow Map', 'Read how your focus data stays local.'],
    ['/terms/', 200, 'Terms — Focus Flow Map', 'Use focus reports with care.'],
    ['/404.html', 200, 'Page not found — Focus Flow Map', 'Page not found.'],
    ['/missing-polish-5-cold', 404, 'Page not found — Focus Flow Map', 'Page not found.'],
  ];

  for (const [path, status, title, heading] of expectedRoutes) {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), status, `${path} HTTP status`);
    assert.equal(await page.title(), title, `${path} title`);
    assert.equal(await page.locator('h1').count(), 1, `${path} h1 count`);
    assert.equal((await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim(), heading, `${path} h1`);
    const facts = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      main: Boolean(document.querySelector('main')),
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ?? '',
      missingAlt: [...document.querySelectorAll('img')].filter((image) => !image.hasAttribute('alt')).length,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));
    assert.equal(facts.lang, 'en');
    assert.equal(facts.main, true);
    assert.ok(facts.description);
    assert.ok(facts.canonical);
    assert.equal(facts.ogTitle, title);
    assert.equal(facts.twitterTitle, title);
    assert.equal(facts.missingAlt, 0);
    assert.equal(facts.horizontalOverflow, false);
    if (status === 200) assert.deepEqual(errors, [], `${path} console errors`);
    report.routes[path] = { status, title, heading, errors: status === 200 ? errors : ['expected 404 network diagnostic excluded'], ...facts };
    await context.close();
  }

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${origin}/`, { waitUntil: 'networkidle' });
  const factTexts = [
    'Recording begins only when you choose.',
    'Route reports use local extension storage.',
    'Download Markdown and JSON route reports.',
  ];
  const factBounds = [];
  for (const text of factTexts) {
    const box = await mobilePage.locator('.hero-facts').getByText(text, { exact: true }).boundingBox();
    assert.ok(box && box.y >= 0 && box.y + box.height <= 844, `${text} must fit in the first phone viewport`);
    factBounds.push({ text, y: box.y, bottom: box.y + box.height });
  }
  await mobilePage.screenshot({ path: resolve(evidenceDir, 'home-first-viewport.png') });
  await mobilePage.getByRole('link', { name: /Try it with sample data/ }).click();
  const firstRow = await mobilePage.locator('.route > li').first().boundingBox();
  assert.ok(firstRow && firstRow.y >= 0 && firstRow.y < 844, 'first sample route row must fit in the phone viewport');
  await mobilePage.screenshot({ path: resolve(evidenceDir, 'demo-first-viewport.png') });
  report.mobile = { viewport: '390x844', factBounds, firstRouteRowY: firstRow.y, routeRows: await mobilePage.locator('.route > li').count() };
  await mobile.close();

  const isolated = await browser.newContext({ serviceWorkers: 'block' });
  const isolatedRequests = [];
  isolated.on('request', (request) => isolatedRequests.push(request.url()));
  const demoPage = await isolated.newPage();
  await demoPage.addInitScript(() => {
    const realKey = 'sb_license:focus-flow-map';
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    const originalRemove = Storage.prototype.removeItem;
    originalSet.call(localStorage, realKey, JSON.stringify({ token: 'live-sentinel', valid: true, checkedAt: Date.now() }));
    const operations = [];
    Object.defineProperty(window, '__ffmStorageOperations', { value: operations, configurable: true });
    Object.defineProperty(window, '__ffmReadStoredValue', { value: (key) => originalGet.call(localStorage, key), configurable: true });
    Storage.prototype.getItem = function getItem(key) { operations.push({ operation: 'get', key }); return originalGet.call(this, key); };
    Storage.prototype.setItem = function setItem(key, value) { operations.push({ operation: 'set', key }); return originalSet.call(this, key, value); };
    Storage.prototype.removeItem = function removeItem(key) { operations.push({ operation: 'remove', key }); return originalRemove.call(this, key); };
  });
  await demoPage.goto(`${origin}/`, { waitUntil: 'networkidle' });
  await demoPage.getByRole('link', { name: /Try it with sample data/ }).click();
  await demoPage.getByRole('button', { name: 'Hide review notes' }).click();
  await demoPage.getByRole('button', { name: 'Reset demo' }).click();
  const operations = await demoPage.evaluate(() => window.__ffmStorageOperations);
  assert.ok(operations.length > 0);
  assert.ok(operations.every(({ key }) => key.startsWith('demo:focus-flow-map:')));
  await demoPage.getByRole('link', { name: 'Start for real' }).click();
  const stored = await demoPage.evaluate(() => ({ real: window.__ffmReadStoredValue('sb_license:focus-flow-map'), demo: window.__ffmReadStoredValue('demo:focus-flow-map:state') }));
  assert.match(stored.real, /live-sentinel/);
  assert.equal(stored.demo, null);
  assert.ok(isolatedRequests.every((url) => new URL(url).origin === origin));
  report.demoIsolation = { operations, storedAfterExit: stored, requestOrigins: [...new Set(isolatedRequests.map((url) => new URL(url).origin))] };
  await isolated.close();

  const focusContext = await browser.newContext({ serviceWorkers: 'block' });
  const focusPage = await focusContext.newPage();
  await focusPage.goto(`${origin}/`, { waitUntil: 'networkidle' });
  await focusPage.waitForFunction(() => document.activeElement === document.querySelector('h1'));
  const initial = await focusPage.locator('h1').innerText();
  await focusPage.locator('footer a[href="/privacy/"]').click();
  await focusPage.waitForFunction(() => document.activeElement === document.querySelector('h1'));
  const privacy = await focusPage.locator('h1').innerText();
  await focusPage.goBack({ waitUntil: 'networkidle' });
  await focusPage.waitForFunction(() => document.activeElement === document.querySelector('h1'));
  const back = await focusPage.locator('h1').innerText();
  const announcement = await focusPage.locator('#route-announcer').innerText();
  assert.equal(initial.replace(/\s+/g, ' ').trim(), 'Map where Tab goes.');
  assert.equal(privacy.trim(), 'Read how your focus data stays local.');
  assert.equal(back.replace(/\s+/g, ' ').trim(), 'Map where Tab goes.');
  assert.equal(announcement.replace(/\s+/g, ' ').trim(), 'Page changed: Map where Tab goes.');
  report.routeFocus = { initial: initial.replace(/\s+/g, ' ').trim(), privacy: privacy.trim(), back: back.replace(/\s+/g, ' ').trim(), announcement: announcement.replace(/\s+/g, ' ').trim() };
  await focusContext.close();

  const fallbackContext = await browser.newContext({ serviceWorkers: 'block' });
  const fallbackPage = await fallbackContext.newPage();
  await fallbackPage.addInitScript(() => localStorage.setItem('sb_license:focus-flow-map', JSON.stringify({ token: 'live-offline-fixture', valid: false, checkedAt: 0 })));
  await fallbackPage.route('https://api.sociobot.in/**', (route) => route.abort('internetdisconnected'));
  await fallbackPage.goto(`${origin}/`, { waitUntil: 'networkidle' });
  const fallbackMessage = await fallbackPage.locator('#license-result').innerText();
  assert.equal(fallbackMessage, 'Offline. The sample route remains available after your first visit.');
  report.offline.fallbackMessage = fallbackMessage;
  await fallbackContext.close();

  const offlineContext = await browser.newContext({ serviceWorkers: 'allow' });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
  await offlinePage.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, { timeout: 15_000 }).catch(async () => {
    await offlinePage.reload();
    await offlinePage.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, { timeout: 15_000 });
  });
  await offlinePage.reload();
  await offlineContext.setOffline(true);
  await offlinePage.reload();
  assert.equal(await offlinePage.locator('.route > li').count(), 6);
  await offlinePage.getByRole('button', { name: 'Hide review notes' }).click();
  assert.equal(await offlinePage.locator('#demo-findings').isHidden(), true);
  await offlinePage.getByRole('button', { name: 'Reset demo' }).click();
  assert.equal(await offlinePage.locator('#demo-findings').isVisible(), true);
  report.offline.demo = { rows: 6, notesToggle: true, reset: true };
  await offlineContext.close();

  const crawlContext = await browser.newContext({ serviceWorkers: 'block' });
  const crawlPage = await crawlContext.newPage();
  await crawlPage.goto(`${origin}/`, { waitUntil: 'networkidle' });
  const links = await crawlPage.locator('a[href]').evaluateAll((anchors) => [...new Set(anchors.map((anchor) => anchor.href))]);
  for (const href of links.filter((href) => new URL(href).origin === origin && !new URL(href).hash)) {
    const response = await crawlContext.request.get(href);
    assert.ok(response.ok(), `${href} should return 2xx`);
    report.links.push({ href, status: response.status() });
  }
  assert.equal(await crawlPage.locator('a[href*="/checkout"]').count(), 0);
  assert.equal((await crawlPage.locator('body').innerText()).includes('ROUTE 014'), false);
  await crawlContext.close();

  const response = await fetch(`${origin}/`, { cache: 'no-store' });
  report.headers = {
    contentSecurityPolicy: response.headers.get('content-security-policy'),
    referrerPolicy: response.headers.get('referrer-policy'),
    contentTypeOptions: response.headers.get('x-content-type-options'),
  };
  assert.match(report.headers.contentSecurityPolicy ?? '', /frame-ancestors 'none'/);
  assert.equal(report.headers.referrerPolicy, 'no-referrer');
  assert.equal(report.headers.contentTypeOptions, 'nosniff');

  await writeFile(resolve(evidenceDir, 'live-check.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ ok: true, evidence: resolve(evidenceDir, 'live-check.json'), mobile: report.mobile, offline: report.offline }));
} finally {
  await browser.close();
}
