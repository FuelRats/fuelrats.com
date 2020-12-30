import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import styles from './MessageBox.module.scss'




// Component Constants
const typeIcons = {
  info: 'exclamation-circle',
  success: 'check-circle',
}





function MessageBox (props) {
  const {
    children,
    className,
    footer,
    type = 'error',
    title,
  } = props

  let { icon } = props
  if (!icon) {
    icon = typeIcons[type] ?? 'exclamation-triangle'
  }

  return (
    <div className={[styles.message, styles[type], 'message', className]}>
      <FontAwesomeIcon
        className={styles.icon}
        icon={icon}
        size="lg" />
      {
        title && (
          <h5 className={styles.title}>{title}</h5>
        )
      }
      <div className={styles.section}>
        {children}
      </div>
      {
        footer && (
          <span className={styles.footer}>
            {footer}
          </span>
        )
      }
    </div>
  )
}

MessageBox.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  footer: PropTypes.node,
  icon: PropTypes.string,
  title: PropTypes.node,
  type: PropTypes.oneOf(['error', 'success', 'warn', 'info']),
}


export default MessageBox
