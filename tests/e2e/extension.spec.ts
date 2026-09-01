import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium, expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

declare const chrome: {
  runtime: {
    sendMessage(message: { type: string; session?: unknown }): Promise<{ ok: boolean }>;
  };
  tabs: {
    query(query: { active: boolean; currentWindow: boolean }): Promise<Array<{ id?: number }>>;
    sendMessage(tabId: number, message: { type: string }): Promise<{ ok: boolean; steps: number }>;
  };
  storage: {
    local: {
      get(key: string): Promise<Record<string, unknown>>;
      set(values: Record<string, unknown>): Promise<void>;
      clear(): Promise<void>;
    };
  };
};

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
  expect(undersized, 'Every rendered extension target must be at least 44×44 CSS px').toEqual([]);
}

test('@claim:explicit-recording @claim:local-session-privacy @claim:sensitive-redaction @claim:markdown-json-export @claim:recorded-route-fields extension records and exports a private local map', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Run the extension smoke test once.');
  const profile = await mkdtemp(join(tmpdir(), 'focus-flow-map-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  try {
    const remoteRequests: string[] = [];
    context.on('request', (request) => {
      const url = new URL(request.url());
      if ((url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== 'http://127.0.0.1:4173') remoteRequests.push(url.href);
    });
    let [worker] = context.serviceWorkers();
    worker ??= await context.waitForEvent('serviceworker');
    const page = await context.newPage();
    const sensitivePath = '/private/focus-flow-map.qa%2Bprivate%40example.com/record';
    await page.goto(`http://127.0.0.1:4173${sensitivePath}?demo=1&query=drop-me#fragment`);
    await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
    await page.waitForTimeout(250);
    expect(await worker.evaluate(() => chrome.storage.local.get('ffm_sessions'))).toEqual({});
    await expect(page.locator('#focus-flow-map-recorder')).toHaveCount(0);
    const started = await worker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error('No active tab');
      return chrome.tabs.sendMessage(tab.id, { type: 'START_RECORDING' });
    });
    expect(started.ok).toBe(true);
    const overlayTargets = await page.locator('#focus-flow-map-recorder').evaluate((host) => (
      [...host.shadowRoot!.querySelectorAll('button')].map((button) => {
        const rect = button.getBoundingClientRect();
        return { name: button.textContent, width: rect.width, height: rect.height };
      }).filter(({ width, height }) => width + 0.01 < 44 || height + 0.01 < 44)
    ));
    expect(overlayTargets, 'Recorder overlay controls must be at least 44×44 CSS px').toEqual([]);
    await page.evaluate(() => {
      const label = document.createElement('label');
      label.htmlFor = 'claim-private-value';
      label.textContent = 'Private test value';
      const input = document.createElement('input');
      input.id = 'claim-private-value';
      input.value = 'never-record-this-input';
      const next = document.createElement('button');
      next.id = 'claim-next-control';
      next.textContent = 'Next sample control';
      document.body.append(label, input, next);
      input.focus();
    });
    await page.waitForTimeout(50);
    await page.locator('#claim-next-control').focus();
    await page.waitForTimeout(50);
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
    // Check extension storage before the dashboard loads. This is the exact
    // verifier reproduction and proves the sensitive path never persists.
    const saved = await worker.evaluate(() => chrome.storage.local.get('ffm_sessions'));
    const savedPacket = JSON.stringify(saved);
    const firstSession = (saved as { ffm_sessions: Array<{ steps: Array<Record<string, unknown>> }> }).ffm_sessions[0];
    expect(firstSession).toBeDefined();
    const recordedSteps = firstSession!.steps;
    expect(recordedSteps.length).toBeGreaterThanOrEqual(2);
    for (const [position, recordedStep] of recordedSteps.entries()) {
      expect(recordedStep).toMatchObject({
        index: position + 1,
        timestamp: expect.any(Number),
        direction: expect.stringMatching(/^(forward|backward|unknown)$/),
        tag: expect.any(String),
        role: expect.any(String),
        label: expect.any(String),
        selector: expect.stringMatching(/^body > /),
        rect: { x: expect.any(Number), y: expect.any(Number), width: expect.any(Number), height: expect.any(Number) },
        viewport: { width: expect.any(Number), height: expect.any(Number), scrollX: expect.any(Number), scrollY: expect.any(Number) },
        scrollDelta: expect.any(Number),
        visible: expect.any(Boolean),
        focusIndicator: expect.any(Boolean),
      });
    }
    expect(savedPacket).toContain('http://127.0.0.1:4173/private/:redacted/record');
    expect(savedPacket).not.toContain('focus-flow-map.qa');
    expect(savedPacket).not.toContain('drop-me');
    expect(savedPacket).not.toContain('fragment');
    expect(savedPacket).not.toContain('never-record-this-input');
    const extensionId = new URL(worker.url()).host;
    const dashboard = await context.newPage();
    await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
    await expect(dashboard.getByRole('heading', { level: 1, name: 'Your focus route' })).toBeVisible();
    await expect(dashboard.locator('#report')).toBeVisible();
    await expect(dashboard.locator('.station')).toHaveCount(stopped.steps);
    await expect(dashboard.locator('#page-meta')).toContainText('http://127.0.0.1:4173/private/:redacted/record');
    await expect(dashboard.locator('#page-meta')).not.toContainText('focus-flow-map.qa');
    const [markdownDownload] = await Promise.all([
      dashboard.waitForEvent('download'),
      dashboard.getByRole('button', { name: 'Export Markdown' }).click(),
    ]);
    const [jsonDownload] = await Promise.all([
      dashboard.waitForEvent('download'),
      dashboard.getByRole('button', { name: 'Export JSON' }).click(),
    ]);
    const markdownPath = join(profile, 'focus-map.md');
    const jsonPath = join(profile, 'focus-map.json');
    await markdownDownload.saveAs(markdownPath);
    await jsonDownload.saveAs(jsonPath);
    for (const packet of [await readFile(markdownPath, 'utf8'), await readFile(jsonPath, 'utf8')]) {
      expect(packet).toContain('http://127.0.0.1:4173/private/:redacted/record');
      expect(packet).not.toContain('focus-flow-map.qa');
      expect(packet).not.toContain('drop-me');
      expect(packet).not.toContain('fragment');
      expect(packet).not.toContain('never-record-this-input');
    }
    expect(remoteRequests).toEqual([]);
    const dashboardAxe = await new AxeBuilder({ page: dashboard }).analyze();
    expect(dashboardAxe.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
    await expectMinimumTargetSize(dashboard);
    await dashboard.setViewportSize({ width: 390, height: 844 });
    await expectMinimumTargetSize(dashboard);
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(popup.locator('h1')).toHaveCount(1);
    const popupAxe = await new AxeBuilder({ page: popup }).analyze();
    expect(popupAxe.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
    await expectMinimumTargetSize(popup);
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});

test('@claim:history-limits @claim:pro-local-notes @claim:pro-price free and Pro storage limits work locally', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Run the extension storage claim once.');
  const profile = await mkdtemp(join(tmpdir(), 'focus-flow-map-history-'));
  const extensionPath = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  try {
    let [worker] = context.serviceWorkers();
    worker ??= await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    const dashboard = await context.newPage();
    await dashboard.goto(`chrome-extension://${extensionId}/dashboard.html`);
    const saveSessions = async (count: number) => dashboard.evaluate(async (total) => {
      for (let index = 0; index < total; index += 1) {
        await chrome.runtime.sendMessage({
          type: 'SAVE_SESSION',
          session: {
            id: `route-${index}`,
            startedAt: new Date(1_788_000_000_000 + index).toISOString(),
            endedAt: new Date(1_788_000_001_000 + index).toISOString(),
            url: 'https://example.com/checkout',
            title: 'Checkout',
            userAgent: 'Recorded fixture',
            steps: [],
          },
        });
      }
      return chrome.storage.local.get('ffm_sessions');
    }, count);

    await dashboard.evaluate(() => chrome.storage.local.clear());
    const free = await saveSessions(2) as { ffm_sessions: unknown[] };
    expect(free.ffm_sessions).toHaveLength(1);

    await dashboard.evaluate(() => chrome.storage.local.set({
      'sb_license:focus-flow-map': { token: 'recorded-valid-license', valid: true, checkedAt: Date.now() },
      ffm_sessions: [],
    }));
    const pro = await saveSessions(31) as { ffm_sessions: unknown[] };
    expect(pro.ffm_sessions).toHaveLength(30);

    await dashboard.reload();
    await expect(dashboard.locator('#history-note')).toHaveText('30 of 30 local sessions saved.');
    await expect(dashboard.locator('#pro-notes')).toBeVisible();
    await dashboard.locator('#audit-note').fill('Ask the checkout team to review the jump.');
    await dashboard.getByRole('button', { name: 'Save note' }).click();
    await expect(dashboard.locator('#export-status')).toHaveText('Private audit note saved on this device.');
    const notes = await dashboard.evaluate(() => localStorage.getItem('ffm_audit_notes'));
    expect(notes).toContain('Ask the checkout team to review the jump.');
    const buy = dashboard.getByRole('link', { name: 'Buy a $24 license' });
    await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/focus-flow-map/checkout');
    await expect(dashboard.getByText('One-time purchase.', { exact: false })).toBeVisible();
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});
