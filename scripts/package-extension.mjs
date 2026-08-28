import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import archiver from 'archiver';

const source = new URL('../.output/chrome-mv3/', import.meta.url);
const downloads = new URL('../site/public/downloads/', import.meta.url);
await mkdir(downloads, { recursive: true });

const output = createWriteStream(new URL('focus-flow-map-chrome.zip', downloads));
const archive = archiver('zip', { zlib: { level: 9 } });
const done = new Promise((resolve, reject) => {
  output.on('close', resolve);
  archive.on('error', reject);
});
archive.pipe(output);
archive.directory(source.pathname, false);
await archive.finalize();
await done;
