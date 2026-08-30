import './style.css';

const STORAGE_KEY = 'sb_license:focus-flow-map';
const VERIFY_URL = 'https://api.sociobot.in/api/v1/products/focus-flow-map/verify';
const DAY = 86_400_000;
type License = { token: string; valid: boolean; checkedAt: number; expiresAt?: string | null };

const menuButton = document.querySelector<HTMLButtonElement>('#menu-button')!;
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu')!;
function closeMobileMenu(returnFocus = false) {
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
});
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  closeMobileMenu();
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileMenu.hidden) closeMobileMenu(true);
});

const findingsButton = document.querySelector<HTMLButtonElement>('#toggle-findings')!;
const findings = document.querySelector<HTMLElement>('#demo-findings')!;
findingsButton.addEventListener('click', () => {
  const visible = findingsButton.getAttribute('aria-expanded') === 'true';
  findingsButton.setAttribute('aria-expanded', String(!visible));
  findings.hidden = visible;
  findingsButton.textContent = visible ? 'Show review notes' : 'Hide review notes';
});

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
  const params = new URLSearchParams(location.search);
  const returned = params.get('license');
  if (returned) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: returned, valid: true, checkedAt: 0 } satisfies License));
    history.replaceState({}, '', `${location.pathname}${location.hash}`);
  }
  const record = readLicense();
  showLicense(record);
  if (record?.token && Date.now() - record.checkedAt >= DAY) {
    try { showLicense(await verify(record.token)); }
    catch { showLicense(record, record.valid ? 'License cached. Verification will retry when you are online.' : 'Offline. Free tools and downloads remain available.'); }
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
  try { await navigator.clipboard.writeText(record.token); showLicense(record, 'License copied. Paste it under Restore in the extension map.'); }
  catch { showLicense(record, 'Copy was blocked. Use your browser’s site storage or return email to retrieve the token.'); }
});

if ('serviceWorker' in navigator) window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
void initialiseLicense();
