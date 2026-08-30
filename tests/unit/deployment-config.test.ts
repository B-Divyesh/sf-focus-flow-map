import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

test('Azure static deployment has the promised cache and browser response policy', async () => {
  const config = JSON.parse(await readFile(resolve(import.meta.dirname, '../../site/public/staticwebapp.config.json'), 'utf8')) as {
    globalHeaders: Record<string, string>;
    routes: { route: string; headers: Record<string, string> }[];
    responseOverrides: Record<string, { rewrite: string }>;
  };
  expect(config.globalHeaders).toMatchObject({
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  expect(config.routes).toEqual(expect.arrayContaining([
    { route: '/assets/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    { route: '/fonts/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    { route: '/sw.js', headers: { 'Cache-Control': 'no-cache' } },
  ]));
});
