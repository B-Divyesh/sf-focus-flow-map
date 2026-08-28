import { browser } from 'wxt/browser';
import { analyseSession, buildJson, buildMarkdown, sanitizeSession } from '../lib/report';
import { CHECKOUT_URL, isFresh, verifyLicense } from '../lib/license';
import { STORAGE, type Finding, type FocusSession, type LicenseRecord } from '../lib/types';
import '../styles/shared.css';
import '../styles/dashboard.css';

const select = document.querySelector<HTMLSelectElement>('#session-select')!;
const empty = document.querySelector<HTMLElement>('#empty-state')!;
const report = document.querySelector<HTMLElement>('#report')!;
const routeList = document.querySelector<HTMLOListElement>('#route-list')!;
const findingsList = document.querySelector<HTMLUListElement>('#findings-list')!;
const exportStatus = document.querySelector<HTMLElement>('#export-status')!;
const licenseState = document.querySelector<HTMLElement>('#license-state')!;
const historyNote = document.querySelector<HTMLElement>('#history-note')!;
const proNotes = document.querySelector<HTMLElement>('#pro-notes')!;
const auditNote = document.querySelector<HTMLTextAreaElement>('#audit-note')!;
let sessions: FocusSession[] = [];
let current: FocusSession | undefined;
let pro = false;

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function findingIcon(finding: Finding) {
  return finding.kind === 'jump' ? '↕' : finding.kind === 'repeat' ? '↻' : finding.kind === 'hidden' ? '◌' : finding.kind === 'stall' ? '⊣' : '◇';
}

function renderSession(session: FocusSession) {
  current = session;
  empty.hidden = true;
  report.hidden = false;
  const findings = analyseSession(session);
  document.querySelector('#step-total')!.textContent = String(session.steps.length);
  document.querySelector('#jump-total')!.textContent = String(findings.filter((item) => item.kind === 'jump').length);
  document.querySelector('#finding-total')!.textContent = String(findings.length);
  const backward = session.steps.filter((step) => step.direction === 'backward').length;
  document.querySelector('#direction-total')!.textContent = backward ? `${backward} reverse` : 'Forward';
  document.querySelector('#page-meta')!.textContent = `${session.url} · ${formatDate(session.startedAt)}`;
  routeList.replaceChildren(...session.steps.map((step) => {
    const item = document.createElement('li');
    if (Math.abs(step.scrollDelta) >= Math.max(240, step.viewport.height * 0.65)) item.classList.add('has-jump');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'station';
    button.innerHTML = `<span class="station-number mono">${step.index}</span><span class="station-copy"><strong></strong><span class="station-meta mono"></span></span><span class="key mono"></span>`;
    button.querySelector('strong')!.textContent = step.label;
    button.querySelector('.station-meta')!.textContent = `${step.role} · y ${Math.round(step.viewport.scrollY)}${step.scrollDelta ? ` · ${step.scrollDelta > 0 ? '+' : ''}${step.scrollDelta}px` : ''}`;
    button.querySelector('.key')!.textContent = step.direction === 'backward' ? '⇧ TAB' : step.direction === 'forward' ? 'TAB' : 'FOCUS';
    button.setAttribute('aria-label', `Step ${step.index}: ${step.label}. ${step.direction}. ${step.scrollDelta ? `Viewport moved ${step.scrollDelta} pixels.` : 'No viewport move.'}`);
    button.addEventListener('click', () => {
      document.querySelectorAll('.station').forEach((node) => node.removeAttribute('aria-current'));
      button.setAttribute('aria-current', 'step');
      exportStatus.textContent = `Step ${step.index}: ${step.selector}; ${step.visible ? 'visible' : 'outside viewport'}; ${step.focusIndicator ? 'focus style detected' : 'no focus style detected'}.`;
    });
    item.append(button);
    return item;
  }));
  findingsList.replaceChildren(...(findings.length ? findings.map((finding) => {
    const item = document.createElement('li');
    item.className = finding.severity;
    item.innerHTML = `<span class="finding-icon" aria-hidden="true">${findingIcon(finding)}</span><span><strong>Step ${finding.step}</strong><br></span>`;
    item.querySelector('span:last-child')!.append(finding.text);
    return item;
  }) : [Object.assign(document.createElement('li'), { className: 'clear', textContent: 'No route checks were raised. Review the order manually before marking it clear.' })]));
  const notes = JSON.parse(localStorage.getItem('ffm_audit_notes') ?? '{}') as Record<string, string>;
  auditNote.value = notes[session.id] ?? '';
}

function renderSessions() {
  select.replaceChildren(...sessions.map((session, index) => {
    const option = document.createElement('option');
    option.value = session.id;
    option.textContent = `${index + 1}. ${formatDate(session.startedAt)} · ${session.steps.length} steps`;
    return option;
  }));
  select.disabled = sessions.length < 2 || !pro;
  historyNote.textContent = pro ? `${sessions.length} of 30 local sessions saved.` : 'Free mode keeps the latest session.';
  if (sessions[0]) renderSession(sessions[0]);
  else { empty.hidden = false; report.hidden = true; }
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

async function applyLicense(record: LicenseRecord | undefined, announce = false) {
  pro = Boolean(record?.valid);
  proNotes.hidden = !pro;
  licenseState.textContent = pro ? 'Pro active on this device' : record ? 'License no longer active' : 'Free mode';
  licenseState.classList.toggle('active', pro);
  renderSessions();
  if (announce) licenseState.focus();
}

async function loadLicense() {
  const params = new URLSearchParams(location.search);
  const returned = params.get('license');
  if (returned) {
    await browser.storage.local.set({ [STORAGE.license]: { token: returned, valid: true, checkedAt: 0 } satisfies LicenseRecord });
    history.replaceState({}, '', location.pathname);
  }
  const stored = await browser.storage.local.get(STORAGE.license);
  const record = stored[STORAGE.license] as LicenseRecord | undefined;
  await applyLicense(record);
  if (record?.token && !isFresh(record)) {
    try {
      const checked = await verifyLicense(record.token);
      await browser.storage.local.set({ [STORAGE.license]: checked });
      await applyLicense(checked);
    } catch {
      licenseState.textContent = pro ? 'Pro active · verification will retry when online' : 'Offline · free tools remain available';
    }
  }
}

select.addEventListener('change', () => {
  const selected = sessions.find((session) => session.id === select.value);
  if (selected) renderSession(selected);
});
document.querySelector('#empty-help')?.addEventListener('click', () => {
  const steps = document.querySelector<HTMLOListElement>('#help-steps')!;
  steps.hidden = !steps.hidden;
});
document.querySelector('#export-markdown')?.addEventListener('click', () => {
  if (!current) return;
  download(`focus-map-${current.id}.md`, buildMarkdown(current), 'text/markdown');
  exportStatus.textContent = 'Markdown issue packet downloaded.';
});
document.querySelector('#export-json')?.addEventListener('click', () => {
  if (!current) return;
  download(`focus-map-${current.id}.json`, buildJson(current), 'application/json');
  exportStatus.textContent = 'JSON evidence downloaded.';
});
document.querySelector('#copy-report')?.addEventListener('click', async () => {
  if (!current) return;
  try { await navigator.clipboard.writeText(buildMarkdown(current)); exportStatus.textContent = 'Issue packet copied.'; }
  catch { exportStatus.textContent = 'Copy was blocked. Use Export Markdown instead.'; }
});
document.querySelector('#save-note')?.addEventListener('click', () => {
  if (!current || !pro) return;
  const notes = JSON.parse(localStorage.getItem('ffm_audit_notes') ?? '{}') as Record<string, string>;
  notes[current.id] = auditNote.value;
  localStorage.setItem('ffm_audit_notes', JSON.stringify(notes));
  exportStatus.textContent = 'Private audit note saved on this device.';
});
const dialog = document.querySelector<HTMLDialogElement>('#delete-dialog')!;
document.querySelector('#delete-session')?.addEventListener('click', () => dialog.showModal());
document.querySelector('#confirm-delete')?.addEventListener('click', async () => {
  if (!current) return;
  sessions = sessions.filter((session) => session.id !== current?.id);
  await browser.storage.local.set({ [STORAGE.sessions]: sessions });
  renderSessions();
});
document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const field = document.querySelector<HTMLInputElement>('#license-token')!;
  licenseState.textContent = 'Verifying license…';
  try {
    const checked = await verifyLicense(field.value.trim());
    await browser.storage.local.set({ [STORAGE.license]: checked });
    field.value = '';
    await applyLicense(checked, true);
  } catch {
    licenseState.textContent = 'Could not verify. Check your connection and try again.';
  }
});

document.querySelector<HTMLAnchorElement>('.license-actions > a.button')!.href = CHECKOUT_URL;
const stored = await browser.storage.local.get(STORAGE.sessions);
const savedSessions = (stored[STORAGE.sessions] as FocusSession[] | undefined) ?? [];
sessions = savedSessions.map(sanitizeSession);
// Existing local-only records predate the privacy repair. Rewrite them when
// the dashboard next opens so they cannot be exported or retained unchanged.
if (JSON.stringify(savedSessions) !== JSON.stringify(sessions)) {
  await browser.storage.local.set({ [STORAGE.sessions]: sessions });
}
renderSessions();
await loadLicense();
