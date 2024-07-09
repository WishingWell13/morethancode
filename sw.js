// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = "morethancode";
const CACHE_VERSION = "v112";

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener("install", function (event) {
  // Tell the active service worker to take control of the page immediately.
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Add all of the URLs here so that they are
        // added to the cache when the ServiceWorker is installed
        const CONTENT_URLS = [
          "/",
          "index.html",
          "content/01-identity.pdf",
          "content/03-diversity-and-inclusion.pdf",
          "content/04-accessibility-and-disability.pdf",
          "assets/scripts/main.js",
          "assets/scripts/progress.js",
          "content/05-racism-and-ethnicity.pdf",
          "content/06-lgbtqia-and-gender.pdf",
          "content/07-classism-and-socioeconomic-status.pdf",
        ];

        return cache.addAll(CONTENT_URLS).catch((error) => {
          console.error("Error adding URLs to cache with addall", error);
          for (let link of CONTENT_URLS) {
            cache.add(link).catch((error) => {
              console.error("sw: add error on", link, " ", error);
              throw error;
            });
          }
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
  //   event.waitUntil(
  //     (async () => {
  //       // Enable navigation preload if it's supported.
  //       // See https://developers.google.com/web/updates/2017/02/navigation-preload
  //       if ("navigationPreload" in self.registration) {
  //         await self.registration.navigationPreload.enable();
  //       }
  //     })()
  //   );

  event.waitUntil(
    caches.keys().then((CACHE_NAME) => {
      return Promise.all(
        CACHE_NAME.map((CACHE_NAME) => caches.delete(CACHE_NAME))
      );
    })
  );

  self.clients.claim();
});

// Intercept fetch requests and cache them
self.addEventListener("fetch", function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // Respond to the event by opening the cache using the name we gave
  // above (CACHE_NAME)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      // Go to the cache first
      return cache.match(event.request.url).then((cachedResponse) => {
        // Return a cached response if we have one
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, hit the network
        return fetch(event.request).then((fetchedResponse) => {
          // Add the network response to the cache for later visits
          cache.put(event.request, fetchedResponse.clone());

          // Return the network response
          return fetchedResponse;
        });
      });
    })
  );
});
