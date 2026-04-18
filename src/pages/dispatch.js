import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'


import { authenticated } from '~/components/AppLayout'
import Clock from '~/components/Clock'
import DispatchTable from '~/components/DispatchTable'
import InstallPwaButton from '~/components/InstallPwaButton'
import NotificationPanel from '~/components/NotificationPanel'
import RescueDetails from '~/components/RescueDetails'
import useDispatchKeyboardNav from '~/hooks/useDispatchKeyboardNav'
import useSoundNotifications from '~/hooks/useSoundNotifications'
import styles from '~/scss/pages/dispatch.module.scss'
import { useRatSocket, useSocketStatus } from '~/services/frSocket'
import { getDispatchBoard } from '~/store/actions/rescues'
import { selectDispatchBoard } from '~/store/selectors/dispatch'
import makeRoute from '~/util/router/makeRoute'





// After the socket reconnects we re-fetch the board to pick up anything
// that happened while we were offline. We wait this long after the
// connection settles so a flapping socket doesn't fire several requests.
const RECONNECT_REFRESH_DEBOUNCE_MS = 1500


function DispatchBoard ({ query }) {
  const dispatch = useDispatch()
  const store = useStore()
  const [loaded, setLoadedState] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [newRescueAnnouncement, setNewRescueAnnouncement] = useState('')
  const [notifPanelOpen, setNotifPanelOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const response = await dispatch(getDispatchBoard())
      if (response?.error) {
        setLoadError(true)
      }
      setLoadedState(true)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, [])

  useRatSocket()
  useDispatchKeyboardNav()
  useSoundNotifications()
  const socketStatus = useSocketStatus()
  const router = useRouter()
  const rescueIds = useSelector(selectDispatchBoard)
  const prevRescueIdsRef = useRef(rescueIds)
  const prevSocketStatusRef = useRef(socketStatus)
  const refreshTimeoutRef = useRef(null)
  const refreshInflightRef = useRef(false)

  // Refresh the board after a real reconnect (we were offline / reconnecting,
  // and the socket just transitioned back to connected). Debounced so a
  // flapping connection doesn't queue up multiple fetches.
  useEffect(() => {
    const prevStatus = prevSocketStatusRef.current
    prevSocketStatusRef.current = socketStatus

    if (!loaded) {
      return undefined
    }

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = null
    }

    const wasOffline = prevStatus === 'reconnecting' || prevStatus === 'disconnected'
    if (socketStatus !== 'connected' || !wasOffline) {
      return undefined
    }

    refreshTimeoutRef.current = setTimeout(() => {
      refreshTimeoutRef.current = null
      if (refreshInflightRef.current) {
        return
      }
      refreshInflightRef.current = true
      Promise.resolve(dispatch(getDispatchBoard())).then((result) => {
        if (result?.error) {
          setLoadError(true)
        }
      }).finally(() => {
        refreshInflightRef.current = false
      })
    }, RECONNECT_REFRESH_DEBOUNCE_MS)

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = null
      }
    }
  }, [socketStatus, loaded, dispatch])

  // Update app badge with active rescue count, clear on unmount
  useEffect(() => {
    if (navigator.setAppBadge) {
      if (rescueIds?.length) {
        navigator.setAppBadge(rescueIds.length)
      } else {
        navigator.clearAppBadge()
      }
    }
  }, [rescueIds])

  useEffect(() => {
    return () => {
      navigator.clearAppBadge?.()
    }
  }, [])

  useEffect(() => {
    const prevIds = prevRescueIdsRef.current
    prevRescueIdsRef.current = rescueIds

    if (!loaded || !prevIds || !rescueIds) {
      return
    }

    if (rescueIds.length > prevIds.length) {
      const newId = rescueIds.find((id) => {
        return !prevIds.includes(id)
      })
      if (newId) {
        // Auto-open the new rescue if nothing is currently open
        if (!router.query.rId) {
          router.push(makeRoute('/dispatch', { rId: newId }))
        }

        // Announce to screen readers
        const rescue = store.getState().rescues?.[newId]
        const client = rescue?.attributes?.client ?? 'unknown client'
        const system = rescue?.attributes?.system ?? 'unknown system'
        const codeRed = rescue?.attributes?.codeRed ? 'Code Red. ' : ''
        setNewRescueAnnouncement(`${codeRed}New rescue: CMDR ${client} in ${system}.`)
      }
    }
  }, [rescueIds, loaded, router, store])

  const statusConfig = {
    connected: { color: '#49c549', label: 'Live' },
    connecting: { color: '#f0ad4e', label: 'Connecting...' },
    reconnecting: { color: '#f0ad4e', label: 'Reconnecting...' },
    disconnected: { color: '#d65050', label: 'Disconnected' },
  }
  const { color: statusColor, label: statusLabel } = statusConfig[socketStatus] ?? statusConfig.disconnected
  const isReconnecting = socketStatus === 'reconnecting'

  return (
    <>
      <Clock className={styles.clock} />
      <div
        aria-atomic="true"
        aria-live="polite"
        className={styles.statusBar}
        role="status">
        <span
          aria-hidden="true"
          className={clsx(styles.statusDot, { [styles.pulse]: isReconnecting })}
          style={{ backgroundColor: statusColor }}
          title={`WebSocket: ${socketStatus}`} />
        <span className="sr-only">{'Connection: '}</span>
        {statusLabel}
        <div className={styles.notifContainer}>
          <button
            aria-label="Notification settings"
            className={clsx('compact', styles.installButton)}
            title="Notification settings"
            type="button"
            onClick={
() => {
  return setNotifPanelOpen((prev) => {
    return !prev
  })
}
}>
            <FontAwesomeIcon fixedWidth icon="bell" />
          </button>
          <NotificationPanel
            open={notifPanelOpen}
            onClose={
() => {
  return setNotifPanelOpen(false)
}
} />
        </div>
        <InstallPwaButton className={styles.installButton} />
      </div>
      <div aria-atomic="true" aria-live="polite" className="sr-only" role="status">
        {newRescueAnnouncement}
      </div>
      <div className={clsx(styles.layout, { [styles.openDetail]: Boolean(query.rId), [styles.stale]: socketStatus !== 'connected' }, 'page-content')}>
        {
          loadError && (
            <div className={styles.loadError}>
              {'Failed to load the dispatch board. '}
              <button
                type="button"
                onClick={
() => {
  return window.location.reload()
}
}>{'Reload'}
              </button>
            </div>
          )
        }
        <DispatchTable className={styles.table} loading={!loaded} />
        {loaded && (<RescueDetails className={styles.detail} rescueId={query.rId} />)}
      </div>
    </>
  )
}

DispatchBoard.getPageMeta = () => {
  return {
    forceDrawer: true,
    className: styles.dispatchBoard,
    title: 'Dispatch Board',
    key: 'dispatch',
    description: 'The Dispatch Portal, used to coordinate rapid and efficient in-game rescues by our dedicated team of Fuel Rats.',
  }
}





export default authenticated(
  'dispatch.read',
  'Sorry, you must be a drilled rat to access the dispatch board.',
)(DispatchBoard)
