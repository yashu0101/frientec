/* ---------------------------------------------------------------------------
   A deliberately small service worker.

   It exists to make the app installable and to survive a dropped connection on
   the shell — not to cache the catalogue. The catalogue, the leads and the orders
   are live data behind an admin panel: serving those from a cache would show a
   shopkeeper yesterday's designs and yesterday's enquiries, which is worse than
   showing them a spinner.

   So: the built shell is precached and served cache-first, because it is
   fingerprinted and cannot go stale. Everything else — /api, /img, /sites — goes
   to the network every time and is never cached.
--------------------------------------------------------------------------- */
const VERSION = 'frientec-shell-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest', './icon.svg']))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),   // a failed precache must not block install
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // live data, always: never answer these from a cache
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/img/') || url.pathname.startsWith('/sites/')) return;

  // cross-origin (the API host when the front end is hosted apart) — leave alone
  if (url.origin !== self.location.origin) return;

  // a navigation with no network falls back to the cached shell; the app then
  // shows its own "could not reach the API" screen, which is the honest state
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).catch(() => caches.match('./index.html')));
    return;
  }

  e.respondWith(
    caches.match(request).then((hit) => hit || fetch(request).then((res) => {
      if (res.ok && /\/assets\//.test(url.pathname)) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(request, copy));
      }
      return res;
    })),
  );
});
