import getConfig from 'next/config'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { subscribePush, unsubscribePush } from '~/store/actions/webPush'
import getResponseError from '~/util/getResponseError'



const { publicRuntimeConfig } = getConfig() ?? {}
const VAPID_PUBLIC_KEY = publicRuntimeConfig?.vapidPublicKey

const BASE64_PAD_MODULO = 4
const READY_TIMEOUT_MS = 3000

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((BASE64_PAD_MODULO - (base64String.length % BASE64_PAD_MODULO)) % BASE64_PAD_MODULO)
  const base64 = (base64String + padding).replace(/-/gu, '+').replace(/_/gu, '/')
  const rawData = atob(base64)
  return Uint8Array.from(rawData, (ch) => {
    return ch.charCodeAt(0)
  })
}


/**
 * Hook for managing push notification subscription state.
 * Returns supported, ready, permission, subscribed, loading, toggle(), and subscribe(filters).
 * @returns {object} Push notification state and controls.
 */
export default function usePushNotifications () {
  const dispatch = useDispatch()
  const [supported, setSupported] = useState(false)
  const [ready, setReady] = useState(false)
  const [permission, setPermission] = useState('default')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (
      typeof window === 'undefined'
      || !Reflect.has(navigator, 'serviceWorker')
      || !Reflect.has(window, 'PushManager')
      || !VAPID_PUBLIC_KEY
    ) {
      return undefined
    }

    setSupported(true)
    setPermission(Notification.permission)

    let cancelled = false

    // navigator.serviceWorker.ready can hang if the SW hasn't activated
    // yet (e.g. first load or update in progress). Race it with a timeout
    // so the button still appears — subscribe() will wait for ready itself.
    const readyTimeout = setTimeout(() => {
      if (!cancelled) {
        setReady(true)
      }
    }, READY_TIMEOUT_MS)

    navigator.serviceWorker.ready.then((registration) => {
      return registration.pushManager.getSubscription()
    }).then((subscription) => {
      if (!cancelled) {
        clearTimeout(readyTimeout)
        setSubscribed(Boolean(subscription))
        setReady(true)
      }
    }).catch(() => {
      if (!cancelled) {
        clearTimeout(readyTimeout)
        setReady(true)
      }
    })

    return () => {
      cancelled = true
      clearTimeout(readyTimeout)
    }
  }, [])


  const subscribe = useCallback(async (filters = {}) => {
    if (!supported || loading) {
      return
    }

    setLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      setPermission(Notification.permission)

      const response = await dispatch(subscribePush(subscription, filters))
      const err = getResponseError(response)
      if (err) {
        await subscription.unsubscribe()

        console.error('Push subscription rejected by API:', err.detail ?? err.status)
        return
      }

      setSubscribed(true)
    } catch (err) {
      setPermission(Notification.permission)

      console.error('Push subscribe failed:', err)
    } finally {
      setLoading(false)
    }
  }, [supported, loading, dispatch])


  const toggle = useCallback(async () => {
    if (!supported || loading) {
      return
    }

    if (!subscribed) {
      await subscribe()
      return
    }

    setLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await dispatch(unsubscribePush(subscription.endpoint))
        await subscription.unsubscribe()
      }
      setSubscribed(false)
    } catch (err) {
      console.error('Push unsubscribe failed:', err)
    } finally {
      setLoading(false)
    }
  }, [supported, subscribed, loading, dispatch, subscribe])


  return {
    supported, ready, permission, subscribed, loading, toggle, subscribe,
  }
}
