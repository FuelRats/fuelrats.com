import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { subscribePush, unsubscribePush } from '~/store/actions/webPush'
import getResponseError from '~/util/getResponseError'




// NEXT_PUBLIC_ prefix makes Next.js inline this from .env at compile time.
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY


function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/gu, '+').replace(/_/gu, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}


/**
 * Hook for managing push notification subscription state.
 *
 * Returns:
 *   supported   — browser supports push + SW is registered + VAPID key configured
 *   ready       — initial subscription check has completed
 *   permission  — 'default' | 'granted' | 'denied'
 *   subscribed  — whether the current browser is actively subscribed
 *   loading     — subscribe/unsubscribe in progress
 *   toggle()    — unsubscribe if subscribed (for the bell button)
 *   subscribe(filters) — subscribe with platform/expansion filters
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
      || !('serviceWorker' in navigator)
      || !('PushManager' in window)
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
    }, 3000)

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
        // eslint-disable-next-line no-console
        console.error('Push subscription rejected by API:', err.detail ?? err.status)
        return
      }

      setSubscribed(true)
    } catch (err) {
      setPermission(Notification.permission)
      // eslint-disable-next-line no-console
      console.error('Push subscribe failed:', err)
    } finally {
      setLoading(false)
    }
  }, [supported, loading, dispatch])


  const toggle = useCallback(async () => {
    if (!supported || loading || !subscribed) {
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
      // eslint-disable-next-line no-console
      console.error('Push unsubscribe failed:', err)
    } finally {
      setLoading(false)
    }
  }, [supported, subscribed, loading, dispatch])


  return { supported, ready, permission, subscribed, loading, toggle, subscribe }
}
