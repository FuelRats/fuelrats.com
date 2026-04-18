import ReduxRatSocket from '@fuelrats/web-util/redux-ratsocket'
import Cookies from 'js-cookie'
import getConfig from 'next/config'
import qs from 'qs'
import { useCallback, useEffect, useSyncExternalStore } from 'react'

import { updatesResources } from '~/store/reducers/frAPIResources'




let socketStatus = 'disconnected'
const socketStatusListeners = new Set()

function setSocketStatus (status) {
  socketStatus = status
  socketStatusListeners.forEach((listener) => {
    return listener()
  })
}

const { publicRuntimeConfig } = getConfig() ?? {}

const frSocket = new ReduxRatSocket(
  publicRuntimeConfig?.frSocketUrl,
  {
    transformAction (action) {
      return {
        ...action,
        meta: {
          ...action.meta,
          ...updatesResources(),
        },
      }
    },
  },
)

// Wrap createMiddleware to intercept dispatched actions for socket status tracking
const originalCreateMiddleware = frSocket.createMiddleware.bind(frSocket)
frSocket.createMiddleware = function createMiddleware () {
  const socketMiddleware = originalCreateMiddleware()
  return (store) => {
    const next = socketMiddleware(store)
    return (nextMiddleware) => {
      return (action) => {
        if (typeof action.type === 'string') {
          if (action.type.endsWith('/open')) {
            setSocketStatus('connected')
          } else if (action.type.endsWith('/close')) {
            setSocketStatus(action.payload?.wasClean ? 'disconnected' : 'reconnecting')
          }
        }
        return next(nextMiddleware)(action)
      }
    }
  }
}


/**
 * A hook which connects ReduxEventSource to the fr API while mounted. Once unmounted, it will disconnect.
 */
function useRatSocket () {
  useEffect(() => {
    // do nothing in server render.
    if (typeof window !== 'undefined') {
      const token = Cookies.get('access_token')

      if (token) {
        setSocketStatus('connecting')
        // Delay slightly to ensure Redux middleware has initialized dispatch
        const connectTimeout = setTimeout(() => {
          try {
            frSocket.connect(qs.stringify({ bearer: token }))
          } catch {
            setSocketStatus('disconnected')
          }
        }, 0)

        return () => {
          clearTimeout(connectTimeout)
          frSocket.close()
          setSocketStatus('disconnected')
        }
      }
    }

    return undefined
  }, [])
}

function useSocketStatus () {
  const subscribe = useCallback((onChange) => {
    socketStatusListeners.add(onChange)
    return () => {
      return socketStatusListeners.delete(onChange)
    }
  }, [])

  return useSyncExternalStore(subscribe, () => {
    return socketStatus
  }, () => {
    return 'disconnected'
  })
}


export default frSocket
export { useRatSocket, useSocketStatus }
