import { browser } from 'wxt/browser';
import { defineContentScript } from 'wxt/utils/define-content-script';
import { elementLabel, redactUrl, stableSelector } from '../lib/report';
import { STORAGE, type FocusDirection, type FocusSession, type FocusStep } from '../lib/types';

const HOST_ID = 'focus-flow-map-recorder';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    let session: FocusSession | null = null;
    let direction: FocusDirection = 'unknown';
    let lastScrollY = window.scrollY;
    let tabTimer = 0;

    function createOverlay() {
      document.getElementById(HOST_ID)?.remove();
      const host = document.createElement('div');
      host.id = HOST_ID;
      host.setAttribute('aria-label', 'Focus Flow Map recording controls');
      const root = host.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host{all:initial;position:fixed;z-index:2147483647;right:16px;bottom:16px;color:#f4efd9;font:500 14px/1.35 system-ui,sans-serif}
          .bar{display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 8px 8px 14px;border:1px solid #4b849a;border-radius:8px;background:#071b26;box-shadow:0 8px 28px #0007}
          .dot{width:10px;height:10px;border-radius:50%;background:#ff8066;animation:pulse 1.8s ease-in-out infinite}.count{font-variant-numeric:tabular-nums;color:#cdc6ab}
          button{min-height:44px;padding:0 14px;border:1px solid #ff8066;border-radius:5px;background:#ff8066;color:#071b26;font:700 14px system-ui,sans-serif;cursor:pointer}
          button.secondary{background:transparent;color:#f4efd9;border-color:#4b849a}
          button:focus-visible{outline:3px solid #f4efd9;outline-offset:3px;box-shadow:0 0 0 6px #ff8066}
          @keyframes pulse{50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.dot{animation:none}}
          @media(max-width:520px){:host{right:8px;bottom:8px;left:8px}.bar{justify-content:space-between}.label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}}
        </style>
        <div class="bar" role="status" aria-live="polite">
          <span class="dot" aria-hidden="true"></span><span class="label">Recording focus route</span>
          <span class="count">0 steps</span>
          <button class="secondary" type="button">Open map</button><button type="button">Stop</button>
        </div>`;
      root.querySelector('button.secondary')?.addEventListener('click', () => void browser.runtime.sendMessage({ type: 'OPEN_DASHBOARD' }));
      root.querySelector('button:not(.secondary)')?.addEventListener('click', () => void stopRecording(true));
      document.documentElement.append(host);
    }

    function updateCount() {
      const count = document.getElementById(HOST_ID)?.shadowRoot?.querySelector('.count');
      if (count && session) count.textContent = `${session.steps.length} ${session.steps.length === 1 ? 'step' : 'steps'}`;
    }

    function isOwnControl(target: EventTarget | null): boolean {
      return target instanceof Node && document.getElementById(HOST_ID)?.shadowRoot?.contains(target) === true;
    }

    function capture(element: HTMLElement) {
      if (!session || element.id === HOST_ID || isOwnControl(element)) return;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const step: FocusStep = {
        index: session.steps.length + 1,
        timestamp: Date.now(),
        direction,
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute('role') || element.tagName.toLowerCase(),
        label: elementLabel(element),
        selector: stableSelector(element),
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
        viewport: { width: window.innerWidth, height: window.innerHeight, scrollX: Math.round(window.scrollX), scrollY: Math.round(window.scrollY) },
        scrollDelta: Math.round(window.scrollY - lastScrollY),
        visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth,
        focusIndicator: (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none',
      };
      lastScrollY = window.scrollY;
      session.steps.push(step);
      updateCount();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!session || event.key !== 'Tab' || isOwnControl(event.composedPath()[0] ?? null)) return;
      direction = event.shiftKey ? 'backward' : 'forward';
      const before = document.activeElement;
      window.clearTimeout(tabTimer);
      tabTimer = window.setTimeout(() => {
        if (session && before === document.activeElement && session.steps.length) {
          session.steps[session.steps.length - 1]!.stalled = true;
        }
      }, 180);
    }

    function onFocus(event: FocusEvent) {
      const target = event.target;
      if (target instanceof HTMLElement) window.requestAnimationFrame(() => capture(target));
    }

    async function startRecording() {
      if (session) return { ok: true, alreadyRecording: true };
      session = {
        id: crypto.randomUUID(),
        startedAt: new Date().toISOString(),
        endedAt: '',
        url: redactUrl(location.href),
        title: elementLabel(document.querySelector('h1') ?? document.body),
        userAgent: navigator.userAgent.replace(/\([^)]*\)/, '(details redacted)'),
        steps: [],
      };
      lastScrollY = window.scrollY;
      createOverlay();
      document.addEventListener('keydown', onKeyDown, true);
      document.addEventListener('focusin', onFocus, true);
      await browser.storage.local.set({ [STORAGE.recording]: true });
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) capture(active);
      return { ok: true };
    }

    async function stopRecording(openMap = false) {
      if (!session) return { ok: false, reason: 'not-recording' };
      session.endedAt = new Date().toISOString();
      const finished = session;
      session = null;
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocus, true);
      document.getElementById(HOST_ID)?.remove();
      await browser.runtime.sendMessage({ type: 'SAVE_SESSION', session: finished });
      if (openMap) await browser.runtime.sendMessage({ type: 'OPEN_DASHBOARD' });
      return { ok: true, steps: finished.steps.length };
    }

    browser.runtime.onMessage.addListener(async (message: { type?: string }) => {
      if (message.type === 'START_RECORDING') return startRecording();
      if (message.type === 'STOP_RECORDING') return stopRecording();
      if (message.type === 'GET_STATUS') return { recording: Boolean(session), steps: session?.steps.length ?? 0 };
      return undefined;
    });
  },
});
