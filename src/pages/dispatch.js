import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import Clock from '~/components/Clock'
import DispatchTable from '~/components/DispatchTable'
import RescueDetails from '~/components/RescueDetails'
import styles from '~/scss/pages/dispatch.module.scss'
import { useRatSocket, useSocketStatus } from '~/services/frSocket'
import { getDispatchBoard } from '~/store/actions/rescues'
import { selectDispatchBoard } from '~/store/selectors/dispatch'
import makeRoute from '~/util/router/makeRoute'





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
  const socketStatus = useSocketStatus()
  const router = useRouter()
  const rescueIds = useSelector(selectDispatchBoard)
  const prevRescueIdsRef = useRef(rescueIds)

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
          className={[styles.statusDot, { [styles.pulse]: isReconnecting }]}
          style={{ backgroundColor: statusColor }}
          title={`WebSocket: ${socketStatus}`} />
        {statusLabel}
      </div>
      <div className={[styles.layout, { [styles.openDetail]: Boolean(query.rId), [styles.stale]: socketStatus !== 'connected' }, 'page-content loading loader-dark']}>
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
