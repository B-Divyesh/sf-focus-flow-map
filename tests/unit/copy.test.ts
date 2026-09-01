import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');

async function read(path: string) {
  return readFile(resolve(root, path), 'utf8');
}

describe('plain product language', () => {
  it('uses focus route, route report, and review notes for the same concepts', async () => {
    const [home, readme, terms] = await Promise.all([
      read('site/index.html'),
      read('README.md'),
      read('site/terms/index.html'),
    ]);

    expect(home).toContain('Record one focus route and share its route report.');
    expect(home).toContain('Free keeps your latest route report and both export formats.');
    expect(home).toContain('These review notes support a review.');
    expect(readme).toContain('The review notes support an accessibility review.');
    expect(terms).toContain('Check the review notes before sharing them.');
    expect(home).not.toContain('keyboard route');
    expect(home).not.toContain('focus map');
    expect(readme).not.toContain('generated notes');
    expect(terms).not.toContain('generated notes');
  });

  it('keeps the sample and license recovery language plain', async () => {
    const [home, main] = await Promise.all([read('site/index.html'), read('site/main.ts')]);

    for (const label of [
      'Link · page position 0 · Tab',
      'Button · page position 0 · Tab',
      'Text field · page position 684 · Tab',
      'Page moved down 684 pixels',
    ]) expect(home).toContain(label);
    expect(home).not.toContain('ROUTE 014');
    expect(home).not.toContain('viewport +684 px');
    expect(main).toContain('Your last verified license remains active. We’ll check it again when you are online.');
    expect(main).toContain('Copy the token from your purchase email and paste it into the extension.');
    expect(main).not.toContain('License cached.');
    expect(main).not.toContain('site storage');
  });

  it('states that Pro sales are unavailable without rendering a checkout action', async () => {
    const sources = await Promise.all([
      read('site/index.html'),
      read('site/terms/index.html'),
      read('entrypoints/dashboard.html'),
      read('app/dashboard.ts'),
      read('lib/license.ts'),
      read('README.md'),
    ]);
    const joined = sources.join('\n');
    expect(joined).toContain('Pro license sales are unavailable');
    expect(joined).toContain('There is no purchase action.');
    expect(joined).not.toContain('/checkout');
    expect(joined).not.toMatch(/<a\b[^>]*>[^<]*Buy a [^<]*license/i);
    expect(joined).not.toContain('$24');
    expect(joined).not.toContain('One-time purchase');
  });

  it('names every external website destination before it opens', async () => {
    const sources = await Promise.all([
      read('site/index.html'),
      read('site/privacy/index.html'),
      read('entrypoints/dashboard.html'),
    ]);
    const links = sources.flatMap((source) => [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].flatMap((match) => {
      const attributes = match[1] ?? '';
      const href = attributes.match(/\bhref="([^"]+)"/)?.[1];
      if (!href?.startsWith('https://')) return [];
      const name = (attributes.match(/\baria-label="([^"]+)"/)?.[1] ?? (match[2] ?? '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
      return [{ host: new URL(href).hostname, name }];
    }));

    expect(links).toEqual(expect.arrayContaining([
      expect.objectContaining({ host: 'github.com', name: expect.stringMatching(/github.*external/i) }),
      expect.objectContaining({ host: 'focus-flow-map.sociobot.in', name: expect.stringMatching(/focus flow map.*external/i) }),
    ]));
    expect(links.every(({ name }) => /external/i.test(name))).toBe(true);
  });

  it('expands development abbreviations in reader-facing README copy', async () => {
    const readme = await read('README.md');
    expect(readme).toContain('Manifest V3 (MV3)');
    expect(readme).toContain('Manifest V3 extension worker');
    expect(readme).toContain('automated accessibility checks');
    expect(readme).not.toContain('axe checks');
  });
});
