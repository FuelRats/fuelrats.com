import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { useRescueQueueCount } from '~/hooks/rescueHooks'
import { selectDispatchBoard } from '~/store/selectors/dispatch'

import styles from './DispatchTable.module.scss'
import RescueRow from './RescueRow'





function DispatchTable (props) {
  const {
    className,
  } = props

  const rescueIds = useSelector(selectDispatchBoard)
  const [queueLength, maxClients] = useRescueQueueCount()

  return (
    <section className={[styles.dispatchTable, className]}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th width="50px">{'#'}</th>
            <th>{'CMDR'}</th>
            <th width="85px">{'Platform'}</th>
            <th width="50px">{'Lang'}</th>
            <th>{'System'}</th>
            <th>{'Rats'}</th>
            <th width="45px">{'Info'}</th>
          </tr>
        </thead>
        <tbody>
          {
            rescueIds?.map((rescueId) => {
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
}





export default DispatchTable
