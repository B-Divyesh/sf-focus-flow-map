import './style.css';

const STORAGE_KEY = 'sb_license:focus-flow-map';
const DEMO_PREFIX = 'demo:focus-flow-map:';
const DEMO_STATE_KEY = `${DEMO_PREFIX}state`;
const VERIFY_URL = 'https://api.sociobot.in/api/v1/products/focus-flow-map/verify';
const DAY = 86_400_000;
type License = { token: string; valid: boolean; checkedAt: number; expiresAt?: string | null };
type DemoState = { findingsVisible: boolean };

const params = new URLSearchParams(location.search);
const isDemo = params.get('demo') === '1';

function setMeta(selector: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
}

const menuButton = document.querySelector<HTMLButtonElement>('#menu-button')!;
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu')!;
function closeMobileMenu(returnFocus = false) {
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Open menu';
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
  menuButton.textContent = open ? 'Open menu' : 'Close menu';
});
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  closeMobileMenu();
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileMenu.hidden) closeMobileMenu(true);
});

const findingsButton = document.querySelector<HTMLButtonElement>('#toggle-findings')!;
const findings = document.querySelector<HTMLElement>('#demo-findings')!;
function readDemoState(): DemoState {
  if (!isDemo) return { findingsVisible: true };
  try {
    const saved = JSON.parse(localStorage.getItem(DEMO_STATE_KEY) ?? 'null') as DemoState | null;
    return saved && typeof saved.findingsVisible === 'boolean' ? saved : { findingsVisible: true };
  } catch {
    return { findingsVisible: true };
  }
}

function writeDemoState(state: DemoState) {
  if (isDemo) localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
}

function clearDemoStorage() {
  localStorage.removeItem(DEMO_STATE_KEY);
}

function renderFindings(visible: boolean) {
  findingsButton.setAttribute('aria-expanded', String(visible));
  findings.hidden = !visible;
  findingsButton.textContent = visible ? 'Hide review notes' : 'Show review notes';
}

findingsButton.addEventListener('click', () => {
  const nextVisible = findingsButton.getAttribute('aria-expanded') !== 'true';
  renderFindings(nextVisible);
  writeDemoState({ findingsVisible: nextVisible });
});

function initialiseDemo() {
  document.body.classList.add('demo-mode');
  document.title = 'Demo — Focus Flow Map';
  const demoUrl = 'https://focus-flow-map.sociobot.in/?demo=1';
  const demoTitle = 'Demo — Focus Flow Map';
  const demoDescription = 'Review a six-step sample focus route with a page jump and a missing focus indicator.';
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = demoUrl;
  setMeta('meta[name="description"]', demoDescription);
  setMeta('meta[property="og:url"]', demoUrl);
  setMeta('meta[property="og:title"]', demoTitle);
  setMeta('meta[property="og:description"]', demoDescription);
  setMeta('meta[name="twitter:title"]', demoTitle);
  setMeta('meta[name="twitter:description"]', demoDescription);
  const banner = document.querySelector<HTMLElement>('#demo-banner')!;
  const workspace = document.querySelector<HTMLElement>('#demo-workspace')!;
  const hero = document.querySelector<HTMLElement>('.hero')!;
  const heading = hero.querySelector<HTMLHeadingElement>('h1')!;
  const map = document.querySelector<HTMLElement>('.map-demo')!;
  banner.hidden = false;
  workspace.hidden = false;
  hero.hidden = true;
  heading.textContent = 'Review a sample focus route.';
  document.querySelector('#demo-heading-slot')!.append(heading);
  document.querySelector('#demo-route-slot')!.append(map);
  document.documentElement.classList.remove('demo-loading');

  const state = readDemoState();
  writeDemoState(state);
  renderFindings(state.findingsVisible);

  const status = document.querySelector<HTMLElement>('#demo-status')!;
  document.querySelector<HTMLButtonElement>('#reset-demo')!.addEventListener('click', () => {
    clearDemoStorage();
    const reset = { findingsVisible: true };
    writeDemoState(reset);
    renderFindings(reset.findingsVisible);
    status.textContent = 'Demo reset to the original six-step focus route.';
  });
  document.querySelector<HTMLAnchorElement>('#start-real')!.addEventListener('click', clearDemoStorage);
  window.addEventListener('pagehide', clearDemoStorage);
}

function readLicense(): License | undefined {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as License | undefined; }
  catch { return undefined; }
}

function showLicense(record: License | undefined, message?: string) {
  const result = document.querySelector<HTMLElement>('#license-result')!;
  const copy = document.querySelector<HTMLButtonElement>('#copy-license')!;
  result.textContent = message ?? (record?.valid ? 'License active. Copy it into the extension to unlock local Pro.' : record ? 'License no longer active.' : '');
  result.classList.toggle('valid', Boolean(record?.valid));
  copy.hidden = !record?.valid;
}

async function verify(token: string): Promise<License> {
  const response = await fetch(`${VERIFY_URL}?license=${encodeURIComponent(token)}`);
  if (!response.ok) throw new Error('Verification service unavailable');
  const payload = await response.json() as { valid: boolean; expires_at?: string | null };
  const record = { token, valid: payload.valid, checkedAt: Date.now(), expiresAt: payload.expires_at };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  return record;
}

async function initialiseLicense() {
  const returned = params.get('license');
  if (returned) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: returned, valid: true, checkedAt: 0 } satisfies License));
    history.replaceState({}, '', `${location.pathname}${location.hash}`);
  }
  const record = readLicense();
  showLicense(record);
  if (record?.token && Date.now() - record.checkedAt >= DAY) {
    try { showLicense(await verify(record.token)); }
    catch { showLicense(record, record.valid ? 'Your last verified license remains active. We’ll check it again when you are online.' : 'Offline. The sample route remains available after your first visit.'); }
  }
}

document.querySelector<HTMLFormElement>('#restore-form')!.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = document.querySelector<HTMLInputElement>('#license')!;
  showLicense(undefined, 'Verifying license…');
  try { const record = await verify(input.value.trim()); input.value = ''; showLicense(record); }
  catch { showLicense(readLicense(), 'Could not verify. Check your connection and try again.'); }
});
document.querySelector<HTMLButtonElement>('#copy-license')!.addEventListener('click', async () => {
  const record = readLicense();
  if (!record?.valid) return;
  try { await navigator.clipboard.writeText(record.token); showLicense(record, 'License copied. Paste it into the extension to use local Pro.'); }
  catch { showLicense(record, 'Copy was blocked. Copy the token from your purchase email and paste it into the extension.'); }
});

if (isDemo) initialiseDemo();
else {
  renderFindings(true);
  void initialiseLicense();
}
if ('serviceWorker' in navigator) window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
