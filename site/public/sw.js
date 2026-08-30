// build-site.mjs replaces this marker with a digest of the finished site.
const CACHE = 'focus-flow-map-__BUILD_REVISION__';
const SHELL = ['/', '/privacy/', '/terms/', '/404.html', '/fonts/plex-sans.woff2', '/fonts/plex-mono.woff2', '/assets/mark.svg', '/assets/hero-blueprint-768.webp', ...__SHELL_ASSETS__];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys()
  .then((keys) => Promise.all(keys.filter((key) => key.startsWith('focus-flow-map-') && key !== CACHE).map((key) => caches.delete(key))))
  .then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  const isNavigation = event.request.mode === 'navigate';
  event.respondWith((isNavigation ? fetch(event.request).then((response) => {
    const copy = response.clone();
    void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('/'))) : caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }))).catch(() => isNavigation ? caches.match('/') : undefined));
});
