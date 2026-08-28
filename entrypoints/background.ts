import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import { sanitizeSession } from '../lib/report';
import { STORAGE, type FocusSession, type LicenseRecord } from '../lib/types';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message: { type?: string; session?: FocusSession }) => {
    if (message.type === 'SAVE_SESSION' && message.session) {
      const stored = await browser.storage.local.get([STORAGE.sessions, STORAGE.license]);
      const sessions = (stored[STORAGE.sessions] as FocusSession[] | undefined) ?? [];
      const license = stored[STORAGE.license] as LicenseRecord | undefined;
      const keep = license?.valid ? 30 : 1;
      const safeSession = sanitizeSession(message.session);
      await browser.storage.local.set({
        [STORAGE.sessions]: [safeSession, ...sessions.filter((item) => item.id !== safeSession.id)].slice(0, keep),
        [STORAGE.recording]: false,
      });
      return { ok: true };
    }
    if (message.type === 'OPEN_DASHBOARD') {
      const dashboardUrl = (browser.runtime as unknown as { getURL(path: string): string }).getURL('/dashboard.html');
      await browser.tabs.create({ url: dashboardUrl });
      return { ok: true };
    }
    return undefined;
  });
});
