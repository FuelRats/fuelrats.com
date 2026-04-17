import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { subscribePush, unsubscribePush } from '~/store/actions/webPush'
import getResponseError from '~/util/getResponseError'




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
 *   supported  — browser supports push + SW is registered + VAPID key configured
 *   permission — 'default' | 'granted' | 'denied'
 *   subscribed — whether the current browser is actively subscribed
 *   loading    — subscribe/unsubscribe in progress
 *   toggle()   — subscribe if not subscribed, unsubscribe if subscribed
 */
export default function usePushNotifications () {
  const dispatch = useDispatch()
  const [supported, setSupported] = useState(false)
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
      return
    }

    setSupported(true)
    setPermission(Notification.permission)

    navigator.serviceWorker.ready.then((registration) => {
      return registration.pushManager.getSubscription()
    }).then((subscription) => {
      setSubscribed(Boolean(subscription))
    }).catch(() => {})
  }, [])


  const toggle = useCallback(async () => {
    if (!supported || loading) {
      return
    }

    setLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready

      if (subscribed) {
        // Unsubscribe
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          await dispatch(unsubscribePush(subscription.endpoint))
          await subscription.unsubscribe()
        }
        setSubscribed(false)
      } else {
        // Subscribe — this triggers the browser permission prompt if needed
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })

        setPermission(Notification.permission)

        const response = await dispatch(subscribePush(subscription))
        const err = getResponseError(response)
        if (err) {
          // Roll back browser subscription if API rejected it
          await subscription.unsubscribe()
          throw new Error(err.detail ?? 'Failed to register push subscription')
        }

        setSubscribed(true)
      }
    } catch (err) {
      setPermission(Notification.permission)
      // eslint-disable-next-line no-console
      console.error('Push notification toggle failed:', err)
    } finally {
      setLoading(false)
    }
  }, [supported, subscribed, loading, dispatch])


  return { supported, permission, subscribed, loading, toggle }
}
