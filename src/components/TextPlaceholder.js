import PropTypes from 'prop-types'





function TextPlaceholder ({ size = 10, loading = false }) {
  return (
    <span className="text-placeholder-wrapper">
      <span className={['text-placeholder', { loading }]}>
        {'\u00A0'.repeat(size)}
      </span>
    </span>
  )
}

TextPlaceholder.propTypes = {
  loading: PropTypes.any,
  size: PropTypes.number,
}


export default TextPlaceholder
