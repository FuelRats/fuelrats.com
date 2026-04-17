import Router from 'next/router'
import { useEffect, useRef } from 'react'




const DEFAULT_MESSAGE = 'You have unsaved changes. Are you sure you want to leave?'




/**
 * Warn the user before unloading / navigating if they have unsaved changes.
 *
 * Uses refs internally so the listener reads the latest flags without
 * having to re-bind on every change.
 * @param {boolean} hasUnsavedChanges
 * @param {object} [options]
 * @param {boolean} [options.isSubmitting] Bypasses the prompt on route
 * change while a submit is in-flight (the form is about to navigate
 * intentionally).
 * @param {string} [options.message] Prompt text shown to the user.
 */
export default function useUnsavedChangesGuard (hasUnsavedChanges, options = {}) {
  const { isSubmitting = false, message = DEFAULT_MESSAGE } = options

  const hasUnsavedRef = useRef(hasUnsavedChanges)
  hasUnsavedRef.current = hasUnsavedChanges
  const submittingRef = useRef(isSubmitting)
  submittingRef.current = isSubmitting

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedRef.current) {
        event.preventDefault()
      }
    }

    const handleRouteChange = () => {
      if (hasUnsavedRef.current && !submittingRef.current) {
        // eslint-disable-next-line no-alert -- intentional confirmation dialog
        if (!window.confirm(message)) {
          Router.events.emit('routeChangeError')
          // Throw a string to abort the route change.
          // Next.js catches thrown strings from routeChangeStart without logging them as errors.
          // eslint-disable-next-line no-throw-literal
          throw 'Route change aborted'
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    Router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      Router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [message])
}
