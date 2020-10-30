import PropTypes from 'prop-types'
import React from 'react'





// Component Constants





function AlertCard (props) {
  const {
    className,
  } = props

  return (
    <div className={className} />
  )
}

AlertCard.propTypes = {
  className: PropTypes.string,
}





export default AlertCard
