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

  const url = event.notification.data?.url ?? '/dispatch'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (new URL(client.url).origin === self.location.origin && 'focus' in client) {
          client.focus()
          if (url) {
            client.navigate(url)
          }
          return
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})
