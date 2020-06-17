// as soon as the servie-worker is installed, we then go caches the date.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('BudgetTrackers-cache-v1')
      .then((cache) =>
        cache.addAll([
          '/',
          '/db.js',
          '/index.js',
          '/manifest.json',
          '/styles.css',
        ])
      )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch((err) => { // if natural way goes wrong, we going to get the matching cache and return it back.
      return caches.match(event.request).then((match) => {
        if (match) {
          return match;
        } else if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/');
        }
      });
    })
  );
});
