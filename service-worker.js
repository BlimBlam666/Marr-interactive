const CACHE_NAME = "marr-atlas-github-pages-v1";
const BASE_PATH = "/Marr-interactive";
const APP_ROOT = `${BASE_PATH}/`;
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/404.html",
  "/styles.css",
  "/data.js",
  "/phase2-data.js",
  "/app.js",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/maps/marr.webp",
  "/maps/tree-of-marr.webp",
  "/maps/prison-cages.webp",
  "/maps/marr-village.webp",
  "/maps/village-green.webp",
  "/maps/root-market.webp",
  "/maps/old-shrine.webp",
  "/maps/daemos-watch.webp",
  "/maps/root-gate.webp",
  "/maps/undamarr-overview.webp",
  "/maps/roots-overview.webp",
  "/maps/surface-overview.webp",
  "/maps/ash-cathedral.webp",
  "/maps/lantern-ward.webp",
  "/maps/vault-echoes.webp",
  "/maps/bellfall.webp",
  "/maps/still-yards.webp",
  "/maps/whispering-walks.webp",
  "/maps/root-bell-cavern.webp",
  "/maps/hollow-spiral.webp",
  "/maps/root-notary.webp",
  "/maps/thistlegrasp.webp",
  "/maps/bell-tower-ruin.webp",
  "/maps/grey-orchard.webp",
  "/maps/processional-road.webp",
].map((path) => `${BASE_PATH}${path}`);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);
      const shellResponse = await fetch(APP_ROOT);
      const shellText = await shellResponse.clone().text();
      await cache.put(APP_ROOT, shellResponse);
      const shellAssets = [...shellText.matchAll(/(?:src|href)="([^"]+)"/g)]
        .map((match) => match[1])
        .filter((url) => url.startsWith(BASE_PATH) && !url.startsWith("//"));
      await cache.addAll([...new Set(shellAssets)]);
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match(APP_ROOT)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
    )
  );
});
