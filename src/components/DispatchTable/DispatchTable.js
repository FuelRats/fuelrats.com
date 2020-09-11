import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'

import { selectDispatchBoard } from '~/store/selectors/dispatch'

import styles from './DispatchTable.module.scss'
import RescueRow from './RescueRow'





function DispatchTable (props) {
  const {
    className,
  } = props

  const rescueIds = useSelector(selectDispatchBoard)

  return (
    <section className={[styles.dispatchTable, className]}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th width="50px">{'#'}</th>
            <th>{'CMDR'}</th>
            <th width="50px">{'Lang'}</th>
            <th width="50px">{'Plat'}</th>
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
    </section>
  )
}

DispatchTable.propTypes = {
  className: PropTypes.string,
}





export default DispatchTable
