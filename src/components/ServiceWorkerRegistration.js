import { useEffect } from 'react'




/**
 * Registers the PWA service worker on mount. Only runs in production
 * builds — registering in dev hides webpack hot updates behind cached
 * responses and leads to confusing stale-state bugs.
 */
function ServiceWorkerRegistration () {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }
    if (!('serviceWorker' in navigator)) {
      return undefined
    }
    if (process.env.NODE_ENV !== 'production') {
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
