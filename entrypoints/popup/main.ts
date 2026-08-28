import { browser } from 'wxt/browser';
import { STORAGE, type FocusSession } from '../../lib/types';
import '../../styles/shared.css';
import './style.css';

const recordButton = document.querySelector<HTMLButtonElement>('#record')!;
const openButton = document.querySelector<HTMLButtonElement>('#open-map')!;
const stateLabel = document.querySelector<HTMLElement>('#state-label')!;
const stateDetail = document.querySelector<HTMLElement>('#state-detail')!;
const feedback = document.querySelector<HTMLElement>('#feedback')!;
let activeTabId: number | undefined;
let recording = false;

function extensionUrl(path: string) {
  return (browser.runtime as unknown as { getURL(value: string): string }).getURL(path);
}

async function getActiveTab() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  activeTabId = tab?.id;
  if (!activeTabId || !tab?.url || /^(chrome|edge|about|moz-extension|chrome-extension):/.test(tab.url)) {
    throw new Error('This browser page cannot be recorded. Open a website and try again.');
  }
  return tab;
}

function renderStatus(steps = 0) {
  document.body.classList.toggle('is-recording', recording);
  stateLabel.textContent = recording ? 'Recording is active' : 'Ready to record';
  stateDetail.textContent = recording ? `${steps} ${steps === 1 ? 'focus step' : 'focus steps'} captured on this page.` : 'Nothing is captured until you start.';
  recordButton.textContent = recording ? 'Stop and save' : 'Start recording';
  recordButton.disabled = false;
}

async function initialise() {
  try {
    await getActiveTab();
    try {
      const status = await browser.tabs.sendMessage(activeTabId!, { type: 'GET_STATUS' }) as { recording?: boolean; steps?: number };
      recording = Boolean(status?.recording);
      renderStatus(status?.steps ?? 0);
    } catch {
      renderStatus();
    }
  } catch (error) {
    stateLabel.textContent = 'Recording unavailable';
    stateDetail.textContent = error instanceof Error ? error.message : 'Open a regular web page to record.';
    feedback.textContent = 'You can still open earlier maps.';
  }
  const stored = await browser.storage.local.get(STORAGE.sessions);
  const sessions = (stored[STORAGE.sessions] as FocusSession[] | undefined) ?? [];
  openButton.textContent = sessions.length ? `Open latest map (${sessions[0]?.steps.length ?? 0})` : 'Open map';
}

recordButton.addEventListener('click', async () => {
  recordButton.disabled = true;
  feedback.textContent = recording ? 'Saving the local map…' : 'Starting on this tab…';
  try {
    await getActiveTab();
    const result = await browser.tabs.sendMessage(activeTabId!, { type: recording ? 'STOP_RECORDING' : 'START_RECORDING' }) as { ok?: boolean; steps?: number };
    if (!result?.ok) throw new Error('The page did not accept the recorder. Reload it and try again.');
    recording = !recording;
    renderStatus(result.steps ?? 0);
    feedback.textContent = recording ? 'Use Tab and Shift+Tab on the page. A small stop bar is visible there.' : `Saved ${result.steps ?? 0} steps locally.`;
    if (!recording) window.setTimeout(() => void browser.tabs.create({ url: extensionUrl('/dashboard.html') }), 300);
  } catch (error) {
    feedback.textContent = error instanceof Error ? error.message : 'Could not reach this page. Reload it and try again.';
    recordButton.disabled = false;
  }
});

openButton.addEventListener('click', () => void browser.tabs.create({ url: extensionUrl('/dashboard.html') }));

void initialise();
