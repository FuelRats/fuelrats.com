import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import Clock from '~/components/Clock'
import DispatchTable from '~/components/DispatchTable'
import RescueDetails from '~/components/RescueDetails'
import useDispatchKeyboardNav from '~/hooks/useDispatchKeyboardNav'
import styles from '~/scss/pages/dispatch.module.scss'
import { useRatSocket, useSocketStatus } from '~/services/frSocket'
import { getDispatchBoard } from '~/store/actions/rescues'
import { selectDispatchBoard } from '~/store/selectors/dispatch'
import makeRoute from '~/util/router/makeRoute'
import clsx from 'clsx'





// After the socket reconnects we re-fetch the board to pick up anything
// that happened while we were offline. We wait this long after the
// connection settles so a flapping socket doesn't fire several requests.
const RECONNECT_REFRESH_DEBOUNCE_MS = 1500


function DispatchBoard ({ query }) {
  const dispatch = useDispatch()
  const [loaded, setLoadedState] = useState(false)

  useEffect(() => {
    (async () => {
      await dispatch(getDispatchBoard())
      setLoadedState(true)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, [])

  useRatSocket()
  useDispatchKeyboardNav()
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
      Promise.resolve(dispatch(getDispatchBoard())).finally(() => {
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

  useEffect(() => {
    const prevIds = prevRescueIdsRef.current
    prevRescueIdsRef.current = rescueIds

    if (!loaded || !prevIds || !rescueIds) {
      return
    }

    // If no detail panel is open and a new rescue appeared, auto-open it
    if (!router.query.rId && rescueIds.length > prevIds.length) {
      const newId = rescueIds.find((id) => { return !prevIds.includes(id) })
      if (newId) {
        router.push(makeRoute('/dispatch', { rId: newId }))
      }
    }
  }, [rescueIds, loaded, router])

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
      <div className={styles.statusBar}>
        <span
          className={clsx(styles.statusDot, { [styles.pulse]: isReconnecting })}
          style={{ backgroundColor: statusColor }}
          title={`WebSocket: ${socketStatus}`} />
        {statusLabel}
      </div>
      <div className={clsx(styles.layout, { [styles.openDetail]: Boolean(query.rId), [styles.stale]: socketStatus !== 'connected' }, 'page-content loading loader-dark')}>
        {
          loaded && (
            <>
              <DispatchTable className={styles.table} />
              <RescueDetails className={styles.detail} rescueId={query.rId} />
            </>
          )
        }
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
