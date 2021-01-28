import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import Clock from '~/components/Clock'
import DispatchDetails from '~/components/DispatchDetails'
import DispatchTable from '~/components/DispatchTable'
import styles from '~/scss/pages/dispatch.module.scss'
import { useRatSocket } from '~/services/frSocket'
import { getDispatchBoard } from '~/store/actions/rescues'





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

  return (
    <>
      <Clock className={styles.clock} />
      <div className={[styles.layout, { [styles.openDetail]: Boolean(query.rId) }, 'page-content loading loader-dark']}>
        {
          loaded && (
            <>
              <DispatchTable className={styles.table} />
              <DispatchDetails className={styles.detail} rescueId={query.rId} />
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
    pageKey: 'dispatch',
  }
}





export default authenticated(
  'dispatch.read',
  'Sorry, you must be a drilled rat to access the dispatch board.',
)(DispatchBoard)
