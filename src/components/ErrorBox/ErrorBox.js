import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import cn from '../../helpers/classNames'
import styles from './ErrorBox.module.scss'




export default function ErrorBox (props) {
  const {
    children,
    className,
    footer,
    icon = 'exclamation-triangle',
    title,
  } = props
  return (
    <div className={cn(styles.error, className)}>
      <FontAwesomeIcon
        className={styles.icon}
        icon={icon}
        size="lg" />
      {
        title && (
          <h5 className={`${styles.section} error-title`}>{title}</h5>
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
