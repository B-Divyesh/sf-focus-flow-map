import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/privacy/', '/terms/']) {
  test(`${path} has a semantic, serious-issue-free document`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Focus Flow Map|Privacy|Terms/);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
    expect(serious).toEqual([]);
  });
}

test('download and evidence workflow are usable', async ({ page }) => {
  await page.goto('/');
  const download = page.getByRole('link', { name: /Download for Chromium/i });
  await expect(download).toHaveAttribute('href', '/downloads/focus-flow-map-chrome.zip');
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
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
});
