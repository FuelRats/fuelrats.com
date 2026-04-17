/* eslint-env serviceworker */
/* global self, caches, fetch */

// Bump this string to force a fresh cache when the SW logic itself changes.
// Hashed _next/static assets are immutable, so they're safe to leave alone
// across deploys; we only really need to bust this when changing fetch logic.
const CACHE_NAME = 'fuelrats-v1'

// App shell — what we want available offline at minimum.
const APP_SHELL = [
  '/dispatch',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Failures shouldn't block install — pages may not yet be reachable
        // (e.g. if registration runs before the auth gate redirects elsewhere).
        return Promise.all(
          APP_SHELL.map((url) => {
            return cache.add(url).catch(() => {})
          }),
        )
      }),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => { return key !== CACHE_NAME })
          .map((key) => { return caches.delete(key) }),
      )
    }).then(() => { return self.clients.claim() }),
  )
})

async function cacheFirst (request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }
  const response = await fetch(request)
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())
  }
  return response
}

async function networkFirst (request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    // Final fallback: try the dispatch shell so the app frame still loads.
    const shell = await caches.match('/dispatch')
    if (shell) {
      return shell
    }
    throw err
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  let url
  try {
    url = new URL(request.url)
  } catch {
    return
  }

  // Same-origin only — never touch API / cross-origin requests.
  if (url.origin !== self.location.origin) {
    return
  }

  // Always go to the network for API calls; the dispatch board needs live data.
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Hashed Next.js assets and our own static files are safe to cache aggressively.
  if (
    url.pathname.startsWith('/_next/static/')
    || url.pathname.startsWith('/static/')
    || url.pathname === '/manifest.json'
    || url.pathname === '/favicon.ico'
  ) {
    event.respondWith(cacheFirst(request))
    return
  }

  // HTML navigations: prefer fresh, fall back to cache when offline.
  const accept = request.headers.get('accept') ?? ''
  if (request.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith(networkFirst(request))
  }
})
