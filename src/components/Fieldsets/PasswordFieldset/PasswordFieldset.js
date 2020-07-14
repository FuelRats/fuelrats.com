import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React, { useReducer, useState, useRef } from 'react'
import zxcvbn from 'zxcvbn'

import InputFieldset, { useValidationCallback } from '../InputFieldset'
import styles from './PasswordFieldset.module.scss'





const DEFAULT_MAX_LENGTH = 42





function PasswordFieldset (props) {
  const {
    onValidate: parentValidate,
    displayName = 'Password',
    skipValidation,
    showStrength,
    showWarnings,
    maxLength = DEFAULT_MAX_LENGTH,
    ...inputProps
  } = props

  const inputRef = useRef()

  const [showPassword, handlePasswordVisibility] = useReducer((state) => {
    inputRef.current?.focus()
    return !state
  }, false)

  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleValidate = useValidationCallback(
    (messages, value) => {
      if (skipValidation) {
        return
      }

      if (value.match(/[@&+%~\s]/gu)) {
        messages.errors.push(`${displayName} must not contain "@", "$", "+", "%", "+", or spaces due to limitations in IRC.`)
      }

      if (value.length > maxLength) {
        messages.errors.push(`${displayName} must be no more than ${maxLength} characters long due to limitations in IRC.`)
      }

      const evaluation = zxcvbn(value)

      if (evaluation.feedback.warning) {
        messages.errors.push(evaluation.feedback.warning)
      }

      if (showWarnings) {
        messages.warnings.push(...evaluation.feedback.suggestions)
      }

      if (showStrength) {
        setPasswordStrength(evaluation.score)
      }
    },
    [displayName, maxLength, showStrength, showWarnings, skipValidation],
    parentValidate,
  )

  return (
    <InputFieldset
      ref={inputRef}
      className={styles.passwordInput}
      displayName={displayName}
      minLength={8}
      placeholder="Sup3r-S3cur3-P4ssw0rd"
      {...inputProps}
      type={showPassword ? 'text' : 'password'}
      onValidate={handleValidate}>

      {
        showStrength && (
          <meter
            className={styles.strengthMeter}
            high="3"
            low="2"
            max="4"
            optimum="4"
            value={passwordStrength} />
        )
      }

      <button className={styles.showButton} disabled={inputProps.disabled} tabIndex="-1" type="button" onClick={handlePasswordVisibility}>
        <FontAwesomeIcon fixedWidth icon={showPassword ? 'eye-slash' : 'eye'} />
      </button>

    </InputFieldset>
  )
}

PasswordFieldset.propTypes = {
  showWarnings: PropTypes.any,
  skipValidation: PropTypes.any,
}





export default PasswordFieldset
