/* ═══════════════════════════════════════════════
   ForexGuard — Service Worker
   Strategy: Cache-first for assets, network-first for HTML
   ═══════════════════════════════════════════════ */

const CACHE  = 'fg-v1';
const ASSETS = [
  '/My-Dashboard/',
  '/My-Dashboard/index.html',
  '/My-Dashboard/app.html',
  '/My-Dashboard/css/styles.css',
  '/My-Dashboard/css/landing.css',
  '/My-Dashboard/js/app.js',
  '/My-Dashboard/js/data.js',
  '/My-Dashboard/manifest.json',
  '/My-Dashboard/icons/icon-192.png',
  '/My-Dashboard/icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
];

/* ── Install: pre-cache all static assets ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ── Activate: delete old caches ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Fetch strategy ── */
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // HTML pages: network-first (so updates always reach the user)
  if (request.mode === 'navigate' || request.destination === 'document') {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/My-Dashboard/app.html')))
    );
    return;
  }

  // Everything else: cache-first, fall back to network
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(request, clone));
        return res;
      });
    })
  );
});
