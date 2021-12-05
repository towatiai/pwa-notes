'use strict';

// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';

// Add list of files to cache here.
const FILES_TO_CACHE = [
  '/offline.html',
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // Remove previous cached data from disk.
  evt.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  evt.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      console.log('fetching url: ', evt.request.url);
      const responsePromise = fetch(evt.request);
      const response = await responsePromise;
      console.log('updating cache...');
      await cache.put(evt.request, response.clone());
      return responsePromise;
    } catch (e) {
      console.log('fetching failed, searching cache for: ', evt.request.url);
      const matchPromise = cache.match(evt.request);
      const match = await matchPromise;
      if (match) {
        return matchPromise;
      } else {
        console.log('match not found in cache for: ', evt.request.url);
      }
    }
  })());
});
