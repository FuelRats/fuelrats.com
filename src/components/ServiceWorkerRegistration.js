import { useEffect } from 'react'




/**
 * Registers the PWA service worker on mount. The SW is needed for push
 * notifications even in development. The SW itself only caches static
 * assets and never intercepts webpack HMR requests.
 */
function ServiceWorkerRegistration () {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }
    if (!Reflect.has(navigator, 'serviceWorker')) {
      return undefined
    }

    let cancelled = false
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => {
        if (cancelled) {
          return
        }

        console.error('Service worker registration failed:', err)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return null
}




export default ServiceWorkerRegistration
