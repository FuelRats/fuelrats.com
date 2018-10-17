// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import classNames from '../helpers/classNames'





const TextPlaceholder = ({ size, loading }) => {
  const classes = classNames(
    'text-placeholder',
    ['loading', Boolean(loading)]
  )
  return (
    <span className="text-placeholder-wrapper">
      <span className={classes}>{'\u00A0'.repeat(size)}</span>
    </span>
  )
}

TextPlaceholder.defaultProps = {
  loading: false,
  size: 10,
}

TextPlaceholder.propTypes = {
  loading: PropTypes.any,
  size: PropTypes.number,
}


export default TextPlaceholder
