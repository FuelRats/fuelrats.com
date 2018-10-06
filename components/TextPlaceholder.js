// Module imports
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
  size: 10,
  loading: false,
}

TextPlaceholder.propTypes = {
  size: PropTypes.number,
  loading: PropTypes.any,
}


export default TextPlaceholder
