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
    if (!('serviceWorker' in navigator)) {
      return undefined
    }

    let cancelled = false
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => {
        if (cancelled) {
          return
        }
        // eslint-disable-next-line no-console -- registration failure is rare but worth surfacing
        console.error('Service worker registration failed:', err)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return null
}




export default ServiceWorkerRegistration
