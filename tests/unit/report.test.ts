import { describe, expect, it } from 'vitest';
import { analyseSession, buildJson, buildMarkdown, redactUrl, sanitizeSession, sanitizeText } from '../../lib/report';
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

  it('redacts encoded sensitive path values, opaque tokens, and identifier routes', () => {
    expect(redactUrl('https://example.com/private/focus-flow-map.qa%2Bprivate%40example.com/record?query=drop-me#fragment'))
      .toBe('https://example.com/private/:redacted/record');
    expect(redactUrl('https://example.com/patients/jane-doe/reset/eyJhbGciOiJIUzI1NiJ9.payload.signature'))
      .toBe('https://example.com/patients/:redacted/reset/:redacted');
    expect(redactUrl('https://example.com/projects/route-map/settings')).toBe('https://example.com/projects/:redacted/settings');
  });

  it('redacts unencoded personal names and short values in identifier-bearing paths', () => {
    expect(redactUrl('https://example.com/cases/jane-doe/review')).toBe('https://example.com/cases/:redacted/review');
    expect(redactUrl('https://example.com/cases/alice/review')).toBe('https://example.com/cases/:redacted/review');
    expect(redactUrl('https://example.com/records/AB12')).toBe('https://example.com/records/:redacted');
    expect(redactUrl('file:///Users/alice/private-report.html')).toBe('[URL unavailable]');
  });

  it('redacts email, URL, and token-like labels', () => {
    expect(sanitizeText('Send person@example.com to https://example.com/abcdefghijklmnopqrstuv')).toBe('Send [email redacted] to [URL redacted]');
  });
});

describe('issue packet', () => {
  it('@claim:route-checks flags jumps, hidden targets, stalls, and recent repeats', () => {
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

  it('fixes the verifier encoded-email reproduction at every export boundary', () => {
    const unsafe = {
      ...session([step()]),
      url: 'https://example.com/private/focus-flow-map.qa%2Bprivate%40example.com/record?query=drop-me#fragment',
    };
    const markdown = buildMarkdown(unsafe);
    const json = buildJson(unsafe);
    const safe = sanitizeSession(unsafe);
    for (const packet of [markdown, json, JSON.stringify(safe)]) {
      expect(packet).not.toContain('focus-flow-map.qa');
      expect(packet).not.toContain('drop-me');
      expect(packet).not.toContain('fragment');
      expect(packet).toContain('https://example.com/private/:redacted/record');
    }
  });
});
