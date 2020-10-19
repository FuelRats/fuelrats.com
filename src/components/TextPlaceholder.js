import PropTypes from 'prop-types'





function TextPlaceholder ({ size, loading }) {
  return (
    <span className="text-placeholder-wrapper">
      <span className={['text-placeholder', { loading }]}>
        {'\u00A0'.repeat(size)}
      </span>
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
