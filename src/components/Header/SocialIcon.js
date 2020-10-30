import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'





function SocialIcon (props) {
  const {
    href,
    title,
    ...restProps
  } = props

  return (
    <a
      className="button link"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={title}>
      <FontAwesomeIcon
        fixedWidth
        {...restProps} />
    </a>
  )
}

SocialIcon.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}



export default SocialIcon
