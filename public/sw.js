self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // basic fetch pass-through to ensure the app works offline after caching if needed
  // PWA installability requires a fetch event listener
  event.respondWith(fetch(event.request).catch(() => new Response('Offline Content')));
});
