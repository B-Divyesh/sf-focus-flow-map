import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test, vi } from 'vitest';

type RequestLike = { method: string; mode: string; url: string };
type Handler = (event: { waitUntil?: (promise: Promise<unknown>) => void; request?: RequestLike; respondWith?: (promise: Promise<Response | undefined>) => void }) => void;

class MemoryCaches {
  stores = new Map<string, Map<string, Response>>();

  async open(name: string) {
    const store = this.stores.get(name) ?? new Map<string, Response>();
    this.stores.set(name, store);
    return {
      addAll: async (paths: string[]) => {
        for (const path of paths) store.set(new URL(path, 'https://focus.test').href, await this.fetch(path));
      },
      put: async (request: RequestLike, response: Response) => store.set(request.url, response),
      match: async (request: RequestLike | string) => {
        const key = typeof request === 'string' ? new URL(request, 'https://focus.test').href : request.url;
        return store.get(key)?.clone();
      },
    };
  }

  async keys() { return [...this.stores.keys()]; }
  async delete(name: string) { return this.stores.delete(name); }
  async match(request: RequestLike | string) {
    for (const store of this.stores.values()) {
      const key = typeof request === 'string' ? new URL(request, 'https://focus.test').href : request.url;
      const response = store.get(key);
      if (response) return response.clone();
    }
    return undefined;
  }

  fetch: (input: RequestLike | string) => Promise<Response> = async () => new Response('unconfigured');
}

async function workerFor(revision: string, caches: MemoryCaches) {
  const source = (await readFile(resolve(import.meta.dirname, '../../site/public/sw.js'), 'utf8'))
    .replace('__BUILD_REVISION__', revision)
    .replace('__SHELL_ASSETS__', '[]');
  const handlers = new Map<string, Handler>();
  const skipWaiting = vi.fn();
  const claim = vi.fn();
  const self = {
    addEventListener: (name: string, handler: Handler) => handlers.set(name, handler),
    skipWaiting,
    clients: { claim },
  };
  new Function('self', 'caches', 'fetch', 'location', 'URL', source)(self, caches, caches.fetch, { origin: 'https://focus.test' }, URL);
  return { handlers, skipWaiting, claim };
}

async function dispatchLifecycle(handler: Handler) {
  let pending: Promise<unknown> | undefined;
  handler({ waitUntil: (promise) => { pending = promise; } });
  await pending;
}

async function dispatchFetch(handler: Handler, path: string, mode = 'navigate') {
  let pending: Promise<Response | undefined> | undefined;
  handler({ request: { method: 'GET', mode, url: `https://focus.test${path}` }, respondWith: (promise) => { pending = promise; } });
  return pending;
}

test('a new service-worker revision replaces a stale shell and still works offline', async () => {
  const caches = new MemoryCaches();
  let online = true;
  let responseVersion = 'v1';
  caches.fetch = async (input) => {
    if (!online) throw new Error('offline');
    const path = typeof input === 'string' ? input : new URL(input.url).pathname;
    return new Response(`${responseVersion}:${path}`);
  };

  const v1 = await workerFor('v1', caches);
  await dispatchLifecycle(v1.handlers.get('install')!);
  await dispatchLifecycle(v1.handlers.get('activate')!);
  expect(await (await dispatchFetch(v1.handlers.get('fetch')!, '/'))?.text()).toBe('v1:/');

  responseVersion = 'v2';
  const v2 = await workerFor('v2', caches);
  await dispatchLifecycle(v2.handlers.get('install')!);
  await dispatchLifecycle(v2.handlers.get('activate')!);
  expect(await caches.keys()).toEqual(['focus-flow-map-v2']);
  expect(v2.skipWaiting).toHaveBeenCalledOnce();
  expect(v2.claim).toHaveBeenCalledOnce();
  expect(await (await dispatchFetch(v2.handlers.get('fetch')!, '/'))?.text()).toBe('v2:/');

  online = false;
  expect(await (await dispatchFetch(v2.handlers.get('fetch')!, '/'))?.text()).toBe('v2:/');
});
