import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Claim = {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
};

describe('customer claims manifest', () => {
  it('lists executable claims with exactly one matching test tag', async () => {
    const root = resolve(import.meta.dirname, '../..');
    const claims = JSON.parse(await readFile(resolve(root, '.factory/claims.json'), 'utf8')) as Claim[];
    const testSource = (await Promise.all([
      'tests/e2e/extension.spec.ts',
      'tests/e2e/site.spec.ts',
      'tests/unit/report.test.ts',
    ].map((path) => readFile(resolve(root, path), 'utf8')))).join('\n');

    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim).toEqual({
        id: expect.stringMatching(/^[a-z0-9-]+$/),
        claim: expect.any(String),
        where: expect.any(String),
        test: expect.stringContaining(`@claim:${claim.id}`),
        sandbox: expect.any(String),
      });
      expect(claim.claim.length).toBeGreaterThan(10);
      expect(claim.sandbox.length).toBeGreaterThan(10);
      expect(testSource.split(`@claim:${claim.id}`).length - 1).toBe(1);
    }
  });
});
