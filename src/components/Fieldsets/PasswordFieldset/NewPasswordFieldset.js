import PropTypes from 'prop-types'
import { useState } from 'react'
import zxcvbn from 'zxcvbn'

import { useValidationCallback } from '../InputFieldset'
import PasswordFieldset from './PasswordFieldset'
import styles from './PasswordFieldset.module.scss'





const DEFAULT_MAX_LENGTH = 42





function NewPasswordFieldset (props) {
  const {
    onValidate: parentValidate,
    displayName = 'Password',
    maxLength = DEFAULT_MAX_LENGTH,
    ...inputProps
  } = props

  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleValidate = useValidationCallback(
    (messages, value) => {
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

      messages.warnings.push(...evaluation.feedback.suggestions)

      setPasswordStrength(evaluation.score)
    },
    [displayName, maxLength],
    parentValidate,
  )

  return (
    <PasswordFieldset
      autoComplete="new-password"
      className={styles.newPasswordInput}
      displayName={displayName}
      minLength={12}
      placeholder="Sup3r-S3cur3-P4ssw0rd"
      {...inputProps}
      onValidate={handleValidate}>

      <meter
        className={styles.strengthMeter}
        high="3"
        low="2"
        max="4"
        optimum="4"
        value={passwordStrength} />

    </PasswordFieldset>
  )
}

NewPasswordFieldset.propTypes = {
  displayName: PropTypes.string,
  maxLength: PropTypes.number,
  onValidate: PropTypes.func,
}





export default NewPasswordFieldset
