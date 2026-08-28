import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

declare const chrome: {
  tabs: {
    query(query: { active: boolean; currentWindow: boolean }): Promise<Array<{ id?: number }>>;
    sendMessage(tabId: number, message: { type: string }): Promise<{ ok: boolean; steps: number }>;
  };
};

test('extension records a real Tab route and opens the local map', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Run the extension smoke test once.');
  const profile = await mkdtemp(join(tmpdir(), 'focus-flow-map-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  try {
    let [worker] = context.serviceWorkers();
    worker ??= await context.waitForEvent('serviceworker');
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForTimeout(250);
    const started = await worker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error('No active tab');
      return chrome.tabs.sendMessage(tab.id, { type: 'START_RECORDING' });
    });
    expect(started.ok).toBe(true);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const stopped = await worker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error('No active tab');
      return chrome.tabs.sendMessage(tab.id, { type: 'STOP_RECORDING' });
    });
    expect(stopped.ok).toBe(true);
    expect(stopped.steps).toBeGreaterThanOrEqual(2);
    const extensionId = new URL(worker.url()).host;
    const dashboard = await context.newPage();
    await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
    await expect(dashboard.getByRole('heading', { level: 1, name: 'Your focus route' })).toBeVisible();
    await expect(dashboard.locator('#report')).toBeVisible();
    await expect(dashboard.locator('.station')).toHaveCount(stopped.steps);
    const dashboardAxe = await new AxeBuilder({ page: dashboard }).analyze();
    expect(dashboardAxe.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(popup.locator('h1')).toHaveCount(1);
    const popupAxe = await new AxeBuilder({ page: popup }).analyze();
    expect(popupAxe.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});
