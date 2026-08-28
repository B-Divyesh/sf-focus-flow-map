import type { Finding, FocusSession, FocusStep } from './types';

const EMAIL = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g;
const URL_PATTERN = /https?:\/\/[^\s]+/gi;
const SECRET = /\b(?:bearer\s+)?[A-Za-z0-9_-]{24,}\b/gi;

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
    const path = url.pathname
      .split('/')
      .map((segment) => {
        if (/^\d{5,}$/.test(segment) || /^[0-9a-f-]{16,}$/i.test(segment) || segment.length > 48) {
          return ':redacted';
        }
        return segment;
      })
      .join('/');
    return `${url.origin}${path}`;
  } catch {
    return '[URL unavailable]';
  }
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
  const findings = analyseSession(session);
  const lines = [
    '# Focus Flow Map issue packet',
    '',
    `- Page: ${session.url}`,
    `- Recorded: ${new Date(session.startedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`,
    `- Steps: ${session.steps.length}`,
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
    ...session.steps.map((step) => `| ${step.index} | ${directionLabel(step)} | ${step.label.replace(/\|/g, '\\|')} | \`${step.selector}\` | ${step.viewport.width}×${step.viewport.height}; y ${Math.round(step.viewport.scrollY)} (${step.scrollDelta >= 0 ? '+' : ''}${Math.round(step.scrollDelta)}) |`),
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
