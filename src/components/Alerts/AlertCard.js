import PropTypes from 'prop-types'
import React from 'react'





function AlertCard (props) {
  const {
    className,
  } = props

  return (
    <div className={className} />
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
      createdAt: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timeout: PropTypes.number.isRequired,
      title: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['web-alerts']).isRequired,
  }),
  className: PropTypes.string,
}





export default AlertCard
