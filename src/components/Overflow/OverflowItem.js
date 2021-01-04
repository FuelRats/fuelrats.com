import PropTypes from 'prop-types'





// Component Constants





function OverflowItem (props) {
  const {
    className,
  } = props

  return (
    <div className={className} />
  )
}

OverflowItem.propTypes = {
  className: PropTypes.string,
}





export default OverflowItem
