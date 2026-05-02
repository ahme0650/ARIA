const CACHE_NAME = 'aria-pwa-v1'
const SCOPE_PATH = new URL(self.registration.scope).pathname
const CORE_ASSET_PATHS = [
  '',
  'index.html',
  'manifest.json',
  'favicon.svg',
  'icons.svg',
  'icon-192.png',
  'icon-512.png',
]
const CORE_ASSETS = CORE_ASSET_PATHS.map((path) => `${SCOPE_PATH}${path}`)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_URLS' || !Array.isArray(event.data.urls)) {
    return
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        event.data.urls.map((url) =>
          cache.add(url).catch(() => {
            // Non-critical resources should not break offline preparation.
          }),
        ),
      ),
    ),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(`${SCOPE_PATH}index.html`, copy))
          return response
        })
        .catch(() => caches.match(`${SCOPE_PATH}index.html`)),
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response
        }

        const url = new URL(request.url)
        if (url.origin === self.location.origin) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }

        return response
      })
    }),
  )
})
