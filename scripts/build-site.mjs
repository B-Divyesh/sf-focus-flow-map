import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist/site');
const vite = resolve(root, 'node_modules/vite/bin/vite.js');

await new Promise((resolveBuild, rejectBuild) => {
  const child = spawn(process.execPath, [vite, 'build', '--config', 'vite.site.config.ts'], {
    cwd: root,
    stdio: 'inherit',
  });
  child.once('error', rejectBuild);
  child.once('exit', (code) => code === 0 ? resolveBuild() : rejectBuild(new Error(`Vite build exited with ${code}`)));
});

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return files.flat();
}

// The worker's cache key must change with the rendered site, not just when the
// worker source changes. Hashing the completed static output gives every
// deployment an honest shell revision while preserving reproducible builds.
const files = (await filesIn(output)).filter((file) => {
  const path = relative(output, file);
  return file !== resolve(output, 'sw.js') && !path.startsWith(`downloads${sep}`);
}).sort();
const digest = createHash('sha256');
for (const file of files) {
  digest.update(file.slice(output.length));
  digest.update(await readFile(file));
}
const revision = digest.digest('hex').slice(0, 16);
const workerPath = resolve(output, 'sw.js');
const worker = await readFile(workerPath, 'utf8');
if (!worker.includes('__BUILD_REVISION__')) throw new Error('Service-worker revision placeholder is missing.');
await writeFile(workerPath, worker.replace('__BUILD_REVISION__', revision));
