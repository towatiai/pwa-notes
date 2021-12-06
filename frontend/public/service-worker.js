'use strict';

// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';

// Add list of files to cache here.
const FILES_TO_CACHE = [
  '/index.html',
  '/build/bundle.js',
  '/build/bundle.css'
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

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    if (e.request.url.includes("/api/")) {
      // We don't want to cache api calls, since we have IndexedDB and custom
      // data synchronization mechanism.
      return await fetch(e.request);
    }
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    const cache = await caches.open(CACHE_NAME);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});

/*
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }
  
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
*/