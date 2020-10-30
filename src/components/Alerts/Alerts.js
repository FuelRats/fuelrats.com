import PropTypes from 'prop-types'
import React from 'react'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'

import { selectAlerts } from '~/store/selectors/alerts'

import AlertCard from './AlertCard'
import styles from './Alerts.module.scss'





function Alerts (props) {
  const {
    className,
  } = props

  const activeAlerts = useSelector(selectAlerts)

  return createPortal(
    (
      <div className={[styles.alerts, className]}>
        {
          activeAlerts.map((alert) => {
            return (<AlertCard key={alert.id} alert={alert} />)
          })
        }
      </div>
    ),
    document.getElementById('alert-container'),
  )
}

Alerts.propTypes = {
  className: PropTypes.string,
}





export default Alerts
