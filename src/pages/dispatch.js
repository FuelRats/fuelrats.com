import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { authenticated } from '~/components/AppLayout'
import Clock from '~/components/Clock'
import DispatchTable from '~/components/DispatchTable'
import RescueDetails from '~/components/RescueDetails'
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
    description: 'Access the Fuel Rats Internal Dispatch Portal to coordinate rapid and efficient in-game rescues. Here, our dedicated team of Fuel Rats can respond to distress calls, manage rescue missions, and ensure that every player stranded in the cosmos receives timely assistance. Efficiently navigate through requests and deploy help where it\'s needed most in the gaming universe!',
  }
}





export default authenticated(
  'dispatch.read',
  'Sorry, you must be a drilled rat to access the dispatch board.',
)(DispatchBoard)
