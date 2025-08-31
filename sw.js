// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = "morethancode";
const CACHE_VERSION = "v113";
const FULL_CACHE_NAME = CACHE_NAME + "-" + CACHE_VERSION;

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener("install", function (event) {
  // Tell the active service worker to take control of the page immediately.
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(FULL_CACHE_NAME)
      .then((cache) => {
        // Add all of the URLs here so that they are
        // added to the cache when the ServiceWorker is installed
        const CONTENT_URLS = [
          "/",
          "/index.html",
          "/content/01-identity.pdf",
          "/content/03-diversity-and-inclusion.pdf",
          "/content/04-accessibility-and-disability.pdf",
          "/assets/scripts/main.js",
          "/assets/scripts/progress.js",
          "/content/05-racism-and-ethnicity.pdf",
          "/content/06-lgbtqia-and-gender.pdf",
          "/content/07-classism-and-socioeconomic-status.pdf",
          "/assets/css/common.css",
          "/assets/scripts/themeToggle.js",
          "/assets/images/icons/ujima-icon-500x500.png",
          "/manifest.json"
        ];

        return cache.addAll(CONTENT_URLS).catch((error) => {
          console.error("Error adding URLs to cache with addall", error);
          // Fallback: try to add files individually
          return Promise.allSettled(
            CONTENT_URLS.map(url => 
              cache.add(url).catch((error) => {
                console.error("sw: add error on", url, " ", error);
                return null; // Continue with other files
              })
            )
          );
        });
      })
      .catch((error) => {
        console.error("Error opening cache", error);
        throw error;
      })
  );
});

// Activates the service worker
self.addEventListener("activate", function (event) {
  const currentCacheName = FULL_CACHE_NAME;

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions, but keep the current one
          if (cacheName.startsWith(CACHE_NAME) && cacheName !== currentCacheName) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Intercept fetch requests and cache them
self.addEventListener("fetch", function (event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip requests for extensions or chrome-extension URLs
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://')) {
    return;
  }

  event.respondWith(
    caches.open(FULL_CACHE_NAME).then((cache) => {
      // Go to the cache first
      return cache.match(event.request).then((cachedResponse) => {
        // Return a cached response if we have one
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, hit the network
        return fetch(event.request).then((fetchedResponse) => {
          // Check if we received a valid response
          if (!fetchedResponse || fetchedResponse.status !== 200 || fetchedResponse.type !== 'basic') {
            return fetchedResponse;
          }

          // Add the network response to the cache for later visits
          cache.put(event.request, fetchedResponse.clone());

          // Return the network response
          return fetchedResponse;
        }).catch((error) => {
          console.error('Fetch failed for', event.request.url, error);
          // Return a fallback response or let the error propagate
          throw error;
        });
      });
    })
  );
});
