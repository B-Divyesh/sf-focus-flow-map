import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type Request } from '@playwright/test';

async function expectMinimumTargetSize(page: Page) {
  const undersized = await page.locator('a[href], button, summary, input, select, textarea').evaluateAll((nodes) => nodes.flatMap((node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return [];
    if (rect.width + 0.01 >= 44 && rect.height + 0.01 >= 44) return [];
    return [{
      element: node.tagName.toLowerCase(),
      name: (node.getAttribute('aria-label') || node.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
    }];
  }));
  expect(undersized, 'Every rendered interactive target must be at least 44×44 CSS px').toEqual([]);
}

for (const path of ['/', '/privacy/', '/terms/', '/404.html']) {
  test(`${path} has a semantic, serious-issue-free document`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Focus Flow Map|Privacy|Terms/);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
    expect(serious).toEqual([]);
    await expectMinimumTargetSize(page);
    expect(errors).toEqual([]);
  });
}

const routeMetadata = [
  {
    path: '/',
    title: 'Focus Flow Map — Map the keyboard focus route',
    description: 'Record where Tab moves through a webpage, review jumps and loops, and export a local issue report.',
    canonical: 'https://focus-flow-map.sociobot.in/',
  },
  {
    path: '/?demo=1',
    title: 'Demo — Focus Flow Map',
    description: 'Review a six-step sample keyboard focus route with a viewport jump and a missing focus indicator.',
    canonical: 'https://focus-flow-map.sociobot.in/?demo=1',
  },
  {
    path: '/privacy/',
    title: 'Privacy — Focus Flow Map',
    description: 'Read what Focus Flow Map stores, redacts, and sends when you record a keyboard focus route.',
    canonical: 'https://focus-flow-map.sociobot.in/privacy/',
  },
  {
    path: '/terms/',
    title: 'Terms — Focus Flow Map',
    description: 'Read the terms for using Focus Flow Map, its local reports, and the optional Pro license.',
    canonical: 'https://focus-flow-map.sociobot.in/terms/',
  },
  {
    path: '/404.html',
    title: 'Page not found — Focus Flow Map',
    description: 'The requested Focus Flow Map page was not found.',
    canonical: 'https://focus-flow-map.sociobot.in/404.html',
  },
];

for (const metadata of routeMetadata) {
  test(`${metadata.path} has complete route-specific metadata`, async ({ page }) => {
    await page.goto(metadata.path);
    await expect(page).toHaveTitle(metadata.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', metadata.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', metadata.canonical);
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', metadata.canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', metadata.title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', metadata.description);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://focus-flow-map.sociobot.in/assets/social-card.webp');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', metadata.title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', metadata.description);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://focus-flow-map.sociobot.in/assets/social-card.webp');
  });
}

test('route changes move focus to the new h1 and announce it', async ({ page }) => {
  await page.goto('/');
  const homeHeading = page.getByRole('heading', { level: 1 });
  await expect(homeHeading).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Page changed: Map where Tab goes.');

  await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
  const privacyHeading = page.getByRole('heading', { level: 1 });
  await expect(privacyHeading).toBeFocused();
  await expect(privacyHeading).toHaveAttribute('tabindex', '-1');
  await expect(page.locator('#route-announcer')).toHaveText('Page changed: Read how your focus data stays local.');

  await page.goBack();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(homeHeading).toBeFocused();
  await expect(page.locator('#route-announcer')).toHaveText('Page changed: Map where Tab goes.');
});

test('@claim:demo-isolated first-screen demo uses only its sample namespace', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.addInitScript(() => {
    const realKey = 'sb_license:focus-flow-map';
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    const originalRemove = Storage.prototype.removeItem;
    originalSet.call(localStorage, realKey, JSON.stringify({ token: 'real-sentinel', valid: true, checkedAt: Date.now() }));
    const operations: Array<{ operation: string; key: string }> = [];
    Object.defineProperty(window, '__ffmStorageOperations', { value: operations, configurable: true });
    Object.defineProperty(window, '__ffmReadStoredValue', {
      value: (key: string) => originalGet.call(localStorage, key),
      configurable: true,
    });
    Storage.prototype.getItem = function getItem(key: string) {
      operations.push({ operation: 'get', key });
      return originalGet.call(this, key);
    };
    Storage.prototype.setItem = function setItem(key: string, value: string) {
      operations.push({ operation: 'set', key });
      return originalSet.call(this, key, value);
    };
    Storage.prototype.removeItem = function removeItem(key: string) {
      operations.push({ operation: 'remove', key });
      return originalRemove.call(this, key);
    };
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Map where Tab goes.');
  await expect(page.getByText(/keyboard-only and RSI-affected users/)).toBeVisible();
  await page.getByRole('link', { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page).toHaveTitle('Demo — Focus Flow Map');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a sample keyboard route.');
  await expect(page.locator('.route > li')).toHaveCount(6);

  const storageOperations = await page.evaluate(() => (
    window as unknown as { __ffmStorageOperations: Array<{ operation: string; key: string }> }
  ).__ffmStorageOperations);
  expect(storageOperations.length).toBeGreaterThan(0);
  expect(storageOperations.every(({ key }) => key.startsWith('demo:focus-flow-map:'))).toBe(true);
  expect(requests.filter((url) => new URL(url).origin !== 'http://127.0.0.1:4173')).toEqual([]);

  await page.getByRole('button', { name: 'Hide review notes' }).click();
  await expect(page.locator('#demo-findings')).toBeHidden();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#demo-findings')).toBeVisible();
  await expect(page.locator('#demo-status')).toHaveText('Demo reset to the original six-step route.');

  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect(page.locator('#demo-banner')).toBeHidden();
  const stored = await page.evaluate(() => {
    const read = (window as unknown as { __ffmReadStoredValue: (key: string) => string | null }).__ffmReadStoredValue;
    return {
      real: read('sb_license:focus-flow-map'),
      demo: read('demo:focus-flow-map:state'),
    };
  });
  expect(stored.real).toContain('real-sentinel');
  expect(stored.demo).toBeNull();
});

test('@claim:mobile-first-view one-click sample and product facts are visible in the first phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const fact of [
    'Recording begins only when you choose.',
    'Routes use local extension storage.',
    'Download Markdown and JSON reports.',
  ]) {
    const box = await page.locator('.hero-facts').getByText(fact, { exact: true }).boundingBox();
    expect(box, `${fact} should render`).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
  await page.getByRole('link', { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  const firstRouteRow = page.locator('.route > li').first();
  const rowBox = await firstRouteRow.boundingBox();
  expect(rowBox, 'The first sample route row should render').not.toBeNull();
  expect(rowBox!.y).toBeGreaterThanOrEqual(0);
  expect(rowBox!.y).toBeLessThan(844);
  await expect(firstRouteRow.getByText('Skip to checkout')).toBeVisible();
});

test('@claim:license-request-minimum-data verification sends only the license token', async ({ page }) => {
  let requestEvidence: { method: string; url: string; headers: Record<string, string>; body: string | null } | undefined;
  await page.addInitScript(() => localStorage.setItem('sb_license:focus-flow-map', JSON.stringify({
    token: 'claim-license-token',
    valid: true,
    checkedAt: 0,
  })));
  await page.route('https://api.sociobot.in/**', async (route) => {
    const request = route.request();
    requestEvidence = {
      method: request.method(),
      url: request.url(),
      headers: await request.allHeaders(),
      body: request.postData(),
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/');
  await expect(page.locator('#license-result')).toHaveText(/License active/);
  expect(requestEvidence).toBeDefined();
  const url = new URL(requestEvidence!.url);
  expect(requestEvidence!.method).toBe('GET');
  expect(url.origin).toBe('https://api.sociobot.in');
  expect(url.pathname).toBe('/api/v1/products/focus-flow-map/verify');
  expect([...url.searchParams.entries()]).toEqual([['license', 'claim-license-token']]);
  expect(requestEvidence!.body).toBeNull();
  expect(Object.values(requestEvidence!.headers).join('\n')).not.toContain('claim-license-token');
});

test('@claim:refund-revokes-pro an invalid refunded license turns off Pro features', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sb_license:focus-flow-map', JSON.stringify({
    token: 'refunded-license-fixture', valid: true, checkedAt: 0,
  })));
  await page.route('https://api.sociobot.in/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'refunded', expires_at: null }) });
  });
  await page.goto('/');
  await expect(page.locator('#license-result')).toHaveText('License no longer active.');
  await expect(page.locator('#copy-license')).toBeHidden();
  await expect(page.locator('.legal-line')).toContainText('A refund stops Pro features.');
});

test('@claim:no-third-party-runtime home and demo load only product scripts, fonts, and storage', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Run the runtime-origin capture once.');
  const context = await browser.newContext({ serviceWorkers: 'block' });
  try {
    const requests: Array<{ url: string; type: string }> = [];
    context.on('request', (request: Request) => requests.push({ url: request.url(), type: request.resourceType() }));
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForLoadState('networkidle');
    await page.goto('http://127.0.0.1:4173/?demo=1');
    await page.waitForLoadState('networkidle');
    expect(requests.length).toBeGreaterThan(0);
    expect(requests.every(({ url }) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
    expect(requests.filter(({ type }) => type === 'script').length).toBeGreaterThan(0);
    expect(requests.filter(({ type }) => type === 'font').length).toBeGreaterThan(0);
    expect(requests.filter(({ type }) => ['fetch', 'xhr', 'ping'].includes(type))).toEqual([]);
    expect(await page.locator('script[src]').evaluateAll((scripts) => scripts.every((script) => new URL((script as HTMLScriptElement).src).origin === location.origin))).toBe(true);
    expect(await page.locator('iframe').count()).toBe(0);
    await expect(page.locator('a[href="https://api.sociobot.in/api/v1/products/focus-flow-map/checkout"]')).toHaveCount(1);
    await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('@claim:keyboard-demo sample report controls work without a mouse', async ({ page }) => {
  await page.goto('/?demo=1');
  const reset = page.getByRole('button', { name: 'Reset demo' });
  for (let index = 0; index < 24 && !(await reset.evaluate((element) => element === document.activeElement)); index += 1) {
    await page.keyboard.press('Tab');
  }
  await expect(reset).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-status')).toHaveText('Demo reset to the original six-step route.');

  const notes = page.getByRole('button', { name: 'Hide review notes' });
  for (let index = 0; index < 8 && !(await notes.evaluate((element) => element === document.activeElement)); index += 1) {
    await page.keyboard.press('Tab');
  }
  await expect(notes).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-findings')).toBeHidden();
});

test('demo is responsive, reduced-motion safe, and free of serious accessibility issues', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?demo=1');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  await expectMinimumTargetSize(page);
});

test('service worker keeps the demo available after an offline reload', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Use one isolated browser context for the offline check.');
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/?demo=1');
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, { timeout: 15_000 }).catch(async () => {
      await page.reload();
      await page.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, { timeout: 15_000 });
    });
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a sample keyboard route.');
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a sample keyboard route.');
    await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  } finally {
    await context.close();
  }
});

test('@claim:chromium-package download and evidence workflow are usable', async ({ page }) => {
  await page.goto('/');
  const download = page.getByRole('link', { name: /Download for Chromium/i });
  await expect(download).toHaveAttribute('href', '/downloads/focus-flow-map-chrome.zip');
  const packageResponse = await page.request.get('/downloads/focus-flow-map-chrome.zip');
  expect(packageResponse.ok()).toBe(true);
  const packageBytes = await packageResponse.body();
  expect(packageBytes.subarray(0, 2).toString()).toBe('PK');
  expect(packageBytes.byteLength).toBeGreaterThan(50_000);
  await page.getByRole('button', { name: 'Hide review notes' }).click();
  await expect(page.locator('#demo-findings')).toBeHidden();
  await page.getByRole('button', { name: 'Show review notes' }).click();
  await expect(page.locator('#demo-findings')).toBeVisible();
});

test('installation copy makes no unmeasured time promise', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Install the extension', { exact: true })).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/install in under a minute/i);
});

test('copy-license action is absent until a valid license exists', async ({ page }) => {
  await page.goto('/');
  const copy = page.locator('#copy-license');
  await expect(copy).toBeHidden();
  expect(await copy.evaluate((node) => ({
    display: getComputedStyle(node).display,
    width: node.getBoundingClientRect().width,
    height: node.getBoundingClientRect().height,
  }))).toEqual({ display: 'none', width: 0, height: 0 });
  await copy.focus();
  expect(await page.evaluate(() => document.activeElement?.id)).not.toBe('copy-license');

  await page.evaluate(() => localStorage.setItem('sb_license:focus-flow-map', JSON.stringify({
    token: 'recorded-valid-license',
    valid: true,
    checkedAt: Date.now(),
  })));
  await page.reload();
  await expect(copy).toBeVisible();
  await expect(copy).toBeEnabled();
});

test('390px navigation opens and closes by keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toHaveAccessibleName('Close menu');
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await expectMinimumTargetSize(page);
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toHaveAccessibleName('Open menu');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(menu).toBeFocused();
});
