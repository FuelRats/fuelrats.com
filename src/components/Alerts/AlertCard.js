import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { deleteAlert } from '~/store/actions/alerts'

import styles from './Alerts.module.scss'





// Component constants
const alertTypeIcons = {
  success: 'thumbs-up',
  info: 'info-circle',
  warn: 'exclamation-circle',
  error: 'exclamation-triangle',
}





function AlertCard (props) {
  const {
    alert,
    className,
  } = props

  const dispatch = useDispatch()

  const { id } = alert

  const handleDismiss = useCallback(() => {
    dispatch(deleteAlert(id))
  }, [dispatch, id])

  useEffect(() => {
    const timeoutRef = setTimeout(handleDismiss, alert.attributes.timeout)

    return () => {
      clearTimeout(timeoutRef)
    }
  }, [alert.attributes.timeout, handleDismiss])

  const {
    title,
    body,
    alertType,
  } = alert.attributes

  return (
    <div className={[styles.alertCard, className]}>
      <header className={styles.header}>
        <h4 className={styles.title}>
          <FontAwesomeIcon fixedWidth icon={alertTypeIcons[alertType]} />
          {title}
        </h4>
        <button
          className="compact"
          type="button"
          onClick={handleDismiss}>
          <FontAwesomeIcon fixedWidth icon="times" />
        </button>
      </header>
      <div className={styles.body}>
        {body}
      </div>
      {
        alertType === AlertCard.Type.ERROR && (
          <menu type="toolbar">
            <div className="secondary">
              <a
                className="button inline link"
                href="https://jira.fuelrats.com/servicedesk/customer/portal/1"
                rel="noopener noreferrer"
                target="_blank">
                <small>
                  <FontAwesomeIcon fixedWidth icon="bug" />
                  {' Report this error.'}
                </small>
              </a>
            </div>
          </menu>
        )
      }
    </div>
  )
}

AlertCard.Type = Object.freeze({
  SUCCESS: 'success',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
})

AlertCard.propTypes = {
  alert: PropTypes.shape({
    attributes: PropTypes.shape({
      alertType: PropTypes.oneOf(Object.values(AlertCard.Type)).isRequired,
      body: PropTypes.node.isRequired,
      createdAt: PropTypes.string.isRequired,
      timeout: PropTypes.number.isRequired,
      title: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['web-alerts']).isRequired,
  }),
  className: PropTypes.string,
}





export default AlertCard
