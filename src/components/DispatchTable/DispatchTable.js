import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { useRescueQueueCount } from '~/hooks/rescueHooks'
import { selectDispatchBoard } from '~/store/selectors/dispatch'

import styles from './DispatchTable.module.scss'
import RescueRow from './RescueRow'




const SKELETON_ROW_COUNT = 4


function SkeletonRow () {
  return (
    <tr aria-hidden="true" className={styles.skeletonRow}>
      <td className={clsx(styles.rescueIdCell, styles.skeletonCell)}>
        <span className={clsx(styles.skeletonBlock, styles.skeletonId)} />
      </td>
      <td className={styles.cmdrCell}><span className={clsx(styles.skeletonBlock, styles.skeletonMd)} /></td>
      <td className={styles.platformCell}><span className={clsx(styles.skeletonBlock, styles.skeletonSm)} /></td>
      <td className={styles.languageCell}><span className={clsx(styles.skeletonBlock, styles.skeletonXs)} /></td>
      <td className={styles.systemCell}><span className={clsx(styles.skeletonBlock, styles.skeletonLg)} /></td>
      <td className={styles.ratsCell}><span className={clsx(styles.skeletonBlock, styles.skeletonMd)} /></td>
      <td className={styles.rescueRowFocus}>
        <span className={clsx(styles.skeletonBlock, styles.skeletonIcon)} />
      </td>
    </tr>
  )
}



function DispatchTable (props) {
  const {
    className,
    loading,
  } = props

  const rescueIds = useSelector(selectDispatchBoard)
  const [queueLength, maxClients] = useRescueQueueCount()
  const showSkeleton = loading && !rescueIds?.length

  // Keep removed IDs visible briefly so the close animation can play
  const CLOSE_FADE_MS = 1500
  const prevIdsRef = useRef(rescueIds)
  const closingRef = useRef([])
  const [, forceUpdate] = useState(0)

  // Detect removals synchronously during render
  const prev = prevIdsRef.current ?? []
  if (rescueIds && rescueIds !== prev && prev.length > 0) {
    const removed = prev.filter((id) => {
      return !rescueIds.includes(id) && !closingRef.current.includes(id)
    })
    if (removed.length > 0) {
      closingRef.current = [...closingRef.current, ...removed]
    }
    prevIdsRef.current = rescueIds
  }

  // Schedule cleanup of closing IDs after animation
  useEffect(() => {
    if (closingRef.current.length === 0) {
      return undefined
    }
    const toRemove = [...closingRef.current]
    const timer = setTimeout(() => {
      closingRef.current = closingRef.current.filter((id) => {
        return !toRemove.includes(id)
      })
      forceUpdate((count) => {
        return count + 1
      })
    }, CLOSE_FADE_MS)
    return () => {
      return clearTimeout(timer)
    }
  }, [closingRef.current.length])

  const closingIds = closingRef.current
  const displayIds = [...(rescueIds ?? []), ...closingIds]

  return (
    <section className={clsx(styles.dispatchTable, className)}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th width="50px">{'#'}</th>
            <th>{'CMDR'}</th>
            <th width="85px">{'Platform'}</th>
            <th width="65px">{'Lang'}</th>
            <th>{'System'}</th>
            <th>{'Rats'}</th>
            <th width="45px">{'Info'}</th>
          </tr>
        </thead>
        <tbody aria-busy={loading || undefined}>
          {
            showSkeleton
              ? Array.from({ length: SKELETON_ROW_COUNT }, (_, idx) => {
                return <SkeletonRow key={idx} />
              })
              : displayIds?.map((rescueId) => {
                return (
                  <RescueRow
                    key={rescueId}
                    closing={closingIds.includes(rescueId)}
                    rescueId={rescueId} />
                )
              })
          }
        </tbody>
      </table>
      <div className={styles.queueLength}>
        <small>{'MAX '}</small>
        {maxClients}
        <small>{' CLIENTS'}</small>
        {
            queueLength > 0 && (
              <>
                <small>{' ( '}</small>
                {queueLength}
                <small>{' IN QUEUE )'}</small>
              </>
            )
          }
      </div>
    </section>
  )
}

DispatchTable.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
}





export default DispatchTable
