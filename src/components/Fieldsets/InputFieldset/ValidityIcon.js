import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

import styles from './InputFieldset.module.scss'




/**
 *
 * @param {*} props component props
 * @param {boolean} props.required When the input is invalid, should the required asterisk be displayed.
 * @returns {Element}
 */
function ValidityIcon (props) {
  const {
    className,
    hasMessages,
    invalidTitle = 'This input is invalid',
    valid,
    validating,
    validatingTitle = 'validating...',
    validTitle = 'This input is valid!',
    validWithMessageTitle = 'This input is valid, however something may be improved.',
    ...restProps
  } = props


  const iconProps = useMemo(() => {
    const nextProps = {
      icon: 'check',
      title: validTitle,
    }

    if (validating) {
      nextProps.icon = 'sync'
      nextProps.spin = true
      nextProps.title = validatingTitle
    } else if (!valid) {
      nextProps.icon = 'exclamation-triangle'
      nextProps.title = invalidTitle
    } else if (hasMessages) {
      nextProps.title = validWithMessageTitle
    }

    return nextProps
  }, [hasMessages, invalidTitle, valid, validTitle, validWithMessageTitle, validating, validatingTitle])



  return (
    <div className={[styles.validityIconGroup, className]}>
      <FontAwesomeIcon
        {...restProps}
        {...iconProps}
        fixedWidth
        className={[styles.validityIcon, { [styles.valid]: valid && !validating }]} />

      {
        Boolean(valid && hasMessages) && (
          <FontAwesomeIcon
            fixedWidth
            className={[styles.warningIcon, className]}
            icon="exclamation-circle"
            title={validWithMessageTitle} />
        )
      }
    </div>
  )
}

ValidityIcon.propTypes = {
  className: PropTypes.string,
  hasMessages: PropTypes.any,
  invalidTitle: PropTypes.string,
  valid: PropTypes.any,
  validating: PropTypes.any,
  validatingTitle: PropTypes.string,
  validTitle: PropTypes.string,
  validWithMessageTitle: PropTypes.string,
}





export default ValidityIcon
