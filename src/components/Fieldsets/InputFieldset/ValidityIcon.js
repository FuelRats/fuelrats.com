import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './InputFieldset.module.scss'





function ValidityIcon (props) {
  const {
    className,
    valid,
    validating,
    hasMessages,
    ...restProps
  } = props

  const iconProps = {
    ...restProps,
    icon: 'check',
    title: 'This input is valid!',
  }

  if (validating) {
    iconProps.icon = 'sync'
    iconProps.spin = true
    iconProps.title = 'validating...'
  } else if (!valid) {
    iconProps.icon = 'exclamation-triangle'
    iconProps.title = 'This input is invalid'
  } else if (hasMessages) {
    iconProps.title = 'This input is valid, however something may be improved.'
  }

  return (
    <div className={[styles.validityIconGroup, className]}>
      <FontAwesomeIcon
        {...iconProps}
        fixedWidth
        className={[styles.validityIcon, { [styles.valid]: valid && !validating }]} />

      {
          Boolean(valid && hasMessages) && (
            <FontAwesomeIcon
              fixedWidth
              className={[styles.warningIcon, className]}
              icon="exclamation-circle"
              title="This input is valid, however something may be improved." />
          )
        }
    </div>
  )
}

ValidityIcon.propTypes = {
  className: PropTypes.string,
  hasMessages: PropTypes.any,
  valid: PropTypes.any,
  validating: PropTypes.any,
}





export default ValidityIcon
