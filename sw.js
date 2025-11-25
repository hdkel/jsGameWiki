const ENABLE_CACHE = false;
const CACHE_VERSION = "v0.1.0";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/logo-controller.svg",
  "/icons/logo.svg"
];

self.addEventListener("install", (event) => {
  if (ENABLE_CACHE) {
    event.waitUntil(
      caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
    );
  }
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  if (ENABLE_CACHE) {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.map((key) => (key === CACHE_VERSION ? null : caches.delete(key))))
      )
    );
  } else {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    );
  }
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (!ENABLE_CACHE) return;

  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests.
  if (url.origin !== self.location.origin) return;

  // App shell and assets: cache-first.
  if (isAssetRequest(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // JSON/data: stale-while-revalidate.
  if (request.headers.get("accept")?.includes("application/json") || url.pathname.endsWith(".json")) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Navigation/doc: network-first with cache fallback.
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
  }
});

function isAssetRequest(request) {
  const dest = request.destination;
  if (dest === "style" || dest === "script" || dest === "font" || dest === "image") {
    return true;
  }
  const url = new URL(request.url);
  return /\.(css|js|mjs|png|svg|ico|webp|jpg|jpeg|gif)$/.test(url.pathname);
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cachedPromise = cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  const cached = await cachedPromise;
  return cached || networkPromise;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}
