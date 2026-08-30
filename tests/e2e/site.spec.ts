import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

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
    expect(errors).toEqual([]);
  });
}

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

test('@claim:keyboard-demo sample report controls work without a mouse', async ({ page }) => {
  await page.goto('/?demo=1');
  const reset = page.getByRole('button', { name: 'Reset demo' });
  for (let index = 0; index < 12 && !(await reset.evaluate((element) => element === document.activeElement)); index += 1) {
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

test('390px navigation opens and closes by keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(menu).toBeFocused();
});
