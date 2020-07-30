import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './MessageBox.module.scss'


const typeIcons = {
  info: 'exclamation-circle',
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
    <div className={[styles.message, styles[`${type}Type`], className]}>
      <FontAwesomeIcon
        className={styles.icon}
        icon={icon}
        size="lg" />
      {
        title && (
          <h5 className={styles.section}>{title}</h5>
        )
      }
      <span className={styles.section}>
        {children}
      </span>
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
  type: PropTypes.oneOf(['error', 'warn', 'info']),
}


export default MessageBox
