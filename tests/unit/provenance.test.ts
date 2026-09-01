import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

test('@claim:original-image-provenance the shipped hero has a local generation record', async () => {
  const root = resolve(import.meta.dirname, '../..');
  const record = JSON.parse(await readFile(resolve(root, 'assets/src/hero-blueprint.json'), 'utf8')) as {
    asset: string;
    model: string;
    generated_at: string;
    prompt: string;
    review: string;
  };
  const design = await readFile(resolve(root, '.factory/design.md'), 'utf8');

  expect(record).toMatchObject({
    asset: 'hero-blueprint.png',
    model: 'factory-image (Azure AI Foundry)',
    generated_at: '2026-08-27',
  });
  expect(record.prompt.length).toBeGreaterThan(400);
  expect(record.review).toContain('Accepted');
  await expect(access(resolve(root, 'assets/src', record.asset))).resolves.toBeUndefined();
  await expect(access(resolve(root, 'site/public/assets/hero-blueprint-1200.webp'))).resolves.toBeUndefined();
  expect(design).toContain('Generated with the factory image model (`factory-image`, Azure AI Foundry) on 2026-08-27.');
  expect(design).toContain('The asset is original to Focus Flow Map');
});
