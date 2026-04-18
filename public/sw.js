/* eslint-env serviceworker */
/* global self */

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Clean up any caches from previous versions that included fetch caching.
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => { return caches.delete(key) }))
    }).then(() => { return self.clients.claim() }),
  )
})


// ── Push Notifications ──────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) {
    return
  }

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'Fuel Rats', body: event.data.text() }
  }

  const { title = 'Fuel Rats', ...options } = payload

  event.waitUntil(
    self.registration.showNotification(title, {
      badge: '/static/favicon/favicon-96.png',
      icon: options.icon ?? '/static/favicon/favicon-196.png',
      ...options,
    }),
  )
})


self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data ?? {}
  const rescueId = data.rescueId
  const targetUrl = data.url ?? '/dispatch'
  const targetPath = rescueId ? `/dispatch?rId=${rescueId}` : targetUrl

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Prefer a window already on the dispatch board
      for (const client of windowClients) {
        const clientUrl = new URL(client.url)
        if (clientUrl.origin !== self.location.origin) {
          continue
        }

        if (clientUrl.pathname === '/dispatch') {
          // Already on dispatch — just navigate to the rescue and focus
          client.navigate(targetPath)
          return client.focus()
        }
      }

      // Fall back to any same-origin window
      for (const client of windowClients) {
        if (new URL(client.url).origin === self.location.origin && 'focus' in client) {
          client.navigate(targetPath)
          return client.focus()
        }
      }

      // No existing window — open a new one
      return self.clients.openWindow(targetPath)
    }),
  )
})
