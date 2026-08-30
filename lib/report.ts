import type { Finding, FocusSession, FocusStep } from './types';

const EMAIL = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g;
const EMAIL_VALUE = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/i;
const URL_PATTERN = /https?:\/\/[^\s]+/gi;
const SECRET = /\b(?:bearer\s+)?[A-Za-z0-9_-]{24,}\b/gi;
const IDENTIFIER_ROUTES = new Set([
  'account', 'accounts', 'case', 'cases', 'client', 'clients', 'company', 'companies',
  'contact', 'contacts', 'customer', 'customers', 'document', 'documents', 'employee',
  'employees', 'file', 'files', 'invoice', 'invoices', 'lead', 'leads', 'member', 'members',
  'order', 'orders', 'organization', 'organizations', 'patient', 'patients', 'person',
  'people', 'profile', 'profiles', 'project', 'projects', 'record', 'records', 'session',
  'sessions', 'staff', 'subscriber', 'subscribers', 'team', 'teams', 'tenant', 'tenants',
  'ticket', 'tickets', 'user', 'users', 'workspace', 'workspaces',
]);
const SECRET_ROUTES = new Set(['auth', 'authorize', 'invite', 'invites', 'login', 'password', 'private', 'reset', 'secret', 'token', 'tokens']);
// A route segment is only retained when it is a common, non-personal part of
// a URL's structure. Keeping arbitrary words would leak short names such as
// `/cases/alice`, which are impossible to distinguish reliably from a route.
const STATIC_ROUTE_SEGMENTS = new Set([
  'about', 'access', 'action', 'actions', 'add', 'admin', 'api', 'app', 'archive',
  'auth', 'authorize', 'billing', 'callback', 'cancel', 'changelog', 'checkout',
  'confirm', 'create', 'dashboard', 'demo', 'docs', 'download', 'edit', 'error',
  'export', 'features', 'form', 'forms', 'help', 'home', 'index', 'invite', 'invites',
  'legal', 'license', 'login', 'logout', 'new', 'notification', 'notifications', 'page',
  'pages', 'password', 'preferences', 'pricing', 'privacy', 'private', 'record', 'reports',
  'reset', 'review', 'search', 'security', 'settings', 'signin', 'signup', 'support', 'terms',
  'token', 'tokens', 'update', 'verify', 'welcome',
]);

function decodePathSegment(segment: string): string {
  let decoded = segment;
  // A value can be encoded more than once by a router. Decode a bounded number
  // of times so `%2540` cannot hide an email address, while never throwing on
  // malformed percent escapes.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

function isOpaqueIdentifier(segment: string): boolean {
  return (
    /^\d+$/.test(segment)
    || /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(segment)
    || /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(segment)
    // Opaque IDs and API tokens normally combine letters with digits or a
    // URL-safe separator. Keeping ordinary route words avoids losing useful
    // route shape such as `/settings/notifications`.
    || (segment.length >= 16 && /[A-Za-z]/.test(segment) && /[0-9_-]/.test(segment))
    || segment.length >= 20
  );
}

export function sanitizeText(value: string | null | undefined, fallback = 'Unlabelled control'): string {
  const clean = (value ?? '')
    .replace(EMAIL, '[email redacted]')
    .replace(URL_PATTERN, '[URL redacted]')
    .replace(SECRET, '[value redacted]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
  return clean || fallback;
}

export function redactUrl(input: string): string {
  try {
    const url = new URL(input);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '[URL unavailable]';
    const segments = url.pathname.split('/');
    const path = segments.map((segment, index) => {
      if (!segment) return segment;
      const decoded = decodePathSegment(segment);
      const routeWord = decoded.toLowerCase();
      const previous = decodePathSegment(segments[index - 1] ?? '').toLowerCase();
      const identifierValue = IDENTIFIER_ROUTES.has(previous);
      const secretValue = SECRET_ROUTES.has(previous);
      if (
        EMAIL_VALUE.test(decoded)
        || decoded.includes('@')
        || identifierValue
        || secretValue
        || isOpaqueIdentifier(decoded)
        || !(IDENTIFIER_ROUTES.has(routeWord) || STATIC_ROUTE_SEGMENTS.has(routeWord))
      ) return ':redacted';
      return segment;
    }).join('/');
    return `${url.origin}${path}`;
  } catch {
    return '[URL unavailable]';
  }
}

/** Apply the same privacy boundary to saved data and every export path. */
export function sanitizeSession(session: FocusSession): FocusSession {
  return {
    ...session,
    url: redactUrl(session.url),
    title: sanitizeText(session.title, 'Untitled page'),
    steps: session.steps.map((step) => ({ ...step, label: sanitizeText(step.label) })),
  };
}

export function elementLabel(element: HTMLElement): string {
  const labelledBy = element.getAttribute('aria-labelledby');
  const referenced = labelledBy
    ?.split(/\s+/)
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ');
  const formLabel = element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement
    ? element.labels?.[0]?.textContent
    : undefined;
  const safeText = element.matches('input, textarea, select') ? '' : element.textContent;
  return sanitizeText(
    element.getAttribute('aria-label') || referenced || formLabel || element.getAttribute('title') || safeText,
  );
}

export function stableSelector(element: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body && parts.length < 5) {
    const tag = current.tagName.toLowerCase();
    const siblings = current.parentElement
      ? [...current.parentElement.children].filter((item) => item.tagName === current?.tagName)
      : [];
    const position = siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(current) + 1})` : '';
    parts.unshift(`${tag}${position}`);
    current = current.parentElement;
  }
  return `body > ${parts.join(' > ')}`;
}

export function analyseSession(session: FocusSession): Finding[] {
  const findings: Finding[] = [];
  session.steps.forEach((step, index) => {
    if (Math.abs(step.scrollDelta) >= Math.max(240, step.viewport.height * 0.65)) {
      findings.push({ kind: 'jump', step: step.index, severity: 'warning', text: `Viewport jumped ${Math.round(step.scrollDelta)} px.` });
    }
    if (!step.visible) {
      findings.push({ kind: 'hidden', step: step.index, severity: 'warning', text: 'Focused control was outside the visible viewport.' });
    }
    if (!step.focusIndicator) {
      findings.push({ kind: 'indicator', step: step.index, severity: 'note', text: 'No computed outline or box shadow was detected.' });
    }
    if (step.stalled) {
      findings.push({ kind: 'stall', step: step.index, severity: 'warning', text: 'Tab did not move focus from this control.' });
    }
    const recent = session.steps.slice(Math.max(0, index - 4), index);
    if (recent.some((other) => other.selector === step.selector)) {
      findings.push({ kind: 'repeat', step: step.index, severity: 'warning', text: 'Focus returned to a recent control; check for a loop or trap.' });
    }
  });
  return findings;
}

function directionLabel(step: FocusStep): string {
  return step.direction === 'backward' ? 'Shift+Tab' : step.direction === 'forward' ? 'Tab' : 'Focus';
}

export function buildMarkdown(session: FocusSession): string {
  const safeSession = sanitizeSession(session);
  const findings = analyseSession(safeSession);
  const lines = [
    '# Focus Flow Map issue packet',
    '',
    `- Page: ${safeSession.url}`,
    `- Recorded: ${new Date(safeSession.startedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`,
    `- Steps: ${safeSession.steps.length}`,
    '- Privacy: query strings, hashes, input values, email-like strings, and token-like strings were not included.',
    '',
    '## Reproduce',
    '',
    '1. Open the page above at the same viewport size.',
    '2. Put focus on the first control listed below.',
    '3. Follow the Tab or Shift+Tab directions in order.',
    '',
    '## Focus route',
    '',
    '| Step | Key | Control | Element | Viewport / scroll |',
    '| ---: | --- | --- | --- | --- |',
    ...safeSession.steps.map((step) => `| ${step.index} | ${directionLabel(step)} | ${step.label.replace(/\|/g, '\\|')} | \`${step.selector}\` | ${step.viewport.width}×${step.viewport.height}; y ${Math.round(step.viewport.scrollY)} (${step.scrollDelta >= 0 ? '+' : ''}${Math.round(step.scrollDelta)}) |`),
    '',
    '## Observations',
    '',
    ...(findings.length
      ? findings.map((finding) => `- Step ${finding.step}: ${finding.text}`)
      : ['- No large jump, off-screen target, recent repeat, stalled Tab, or missing computed focus indicator was detected.']),
    '',
    '_Recorded locally with Focus Flow Map. Review automated observations before filing._',
  ];
  return lines.join('\n');
}

export function buildJson(session: FocusSession): string {
  const safeSession = sanitizeSession(session);
  return JSON.stringify({ ...safeSession, findings: analyseSession(safeSession) }, null, 2);
}
