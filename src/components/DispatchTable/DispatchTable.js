import clsx from 'clsx'
import PropTypes from 'prop-types'
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
              : rescueIds?.map((rescueId) => {
                return (
                  <RescueRow
                    key={rescueId}
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
