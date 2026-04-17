import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'




const DISMISSED_KEY = 'fr.pwaInstallDismissed'




/**
 * Captures the browser's `beforeinstallprompt` event and exposes a button
 * that triggers the native install dialog. Renders nothing on browsers
 * that don't support installable PWAs (iOS Safari, etc.) or once the app
 * has been installed / dismissed.
 */
function InstallPwaButton ({ className }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }
    if (window.localStorage?.getItem(DISMISSED_KEY) === '1') {
      return undefined
    }
    if (window.matchMedia?.('(display-mode: standalone)').matches) {
      return undefined
    }

    const handleBeforeInstall = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    const handleInstalled = () => {
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const handleClick = useCallback(async () => {
    if (!deferredPrompt) {
      return
    }
    setInstalling(true)
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'dismissed') {
        window.localStorage?.setItem(DISMISSED_KEY, '1')
      }
    } finally {
      setDeferredPrompt(null)
      setInstalling(false)
    }
  }, [deferredPrompt])

  if (!deferredPrompt) {
    return null
  }

  return (
    <button
      className={clsx('compact', className)}
      disabled={installing}
      title="Install the dispatch board as a standalone app"
      type="button"
      onClick={handleClick}>
      <FontAwesomeIcon fixedWidth icon="download" />
      {installing ? ' Installing...' : ' Install app'}
    </button>
  )
}

InstallPwaButton.propTypes = {
  className: PropTypes.string,
}




export default InstallPwaButton
