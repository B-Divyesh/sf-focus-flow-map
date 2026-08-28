import { describe, expect, it } from 'vitest';
import { analyseSession, buildMarkdown, redactUrl, sanitizeText } from '../../lib/report';
import type { FocusSession, FocusStep } from '../../lib/types';

function step(overrides: Partial<FocusStep> = {}): FocusStep {
  return {
    index: 1,
    timestamp: 1,
    direction: 'forward',
    tag: 'button',
    role: 'button',
    label: 'Continue',
    selector: 'body > main > button',
    rect: { x: 10, y: 10, width: 100, height: 44 },
    viewport: { width: 1280, height: 800, scrollX: 0, scrollY: 0 },
    scrollDelta: 0,
    visible: true,
    focusIndicator: true,
    ...overrides,
  };
}

function session(steps: FocusStep[]): FocusSession {
  return { id: 'audit-1', startedAt: '2026-08-27T12:00:00.000Z', endedAt: '2026-08-27T12:01:00.000Z', url: 'https://example.com/form', title: 'Form', userAgent: 'Test', steps };
}

describe('privacy helpers', () => {
  it('removes URL queries, hashes, and long identifiers', () => {
    expect(redactUrl('https://example.com/users/68b1ad0c-a10a-4714-bca7-f64b06b34ee9/edit?token=secret#billing')).toBe('https://example.com/users/:redacted/edit');
  });

  it('redacts email, URL, and token-like labels', () => {
    expect(sanitizeText('Send person@example.com to https://example.com/abcdefghijklmnopqrstuv')).toBe('Send [email redacted] to [URL redacted]');
  });
});

describe('issue packet', () => {
  it('flags jumps, hidden targets, stalls, and recent repeats', () => {
    const route = session([
      step(),
      step({ index: 2, selector: 'body > main > a', scrollDelta: 700, visible: false, focusIndicator: false, stalled: true }),
      step({ index: 3 }),
    ]);
    const findings = analyseSession(route);
    expect(findings.map((item) => item.kind)).toEqual(expect.arrayContaining(['jump', 'hidden', 'indicator', 'stall', 'repeat']));
  });

  it('creates a reproducible Markdown route', () => {
    const markdown = buildMarkdown(session([step()]));
    expect(markdown).toContain('# Focus Flow Map issue packet');
    expect(markdown).toContain('| 1 | Tab | Continue |');
    expect(markdown).toContain('query strings, hashes, input values');
  });
});
