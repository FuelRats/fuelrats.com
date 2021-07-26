import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'


import { useValidationCallback } from '~/components/Fieldsets/InputFieldset'
import PasswordFieldset from '~/components/Fieldsets/PasswordFieldset'
import { fieldPropTypes } from '~/hooks/useForm'
import { useFormContext } from '~/hooks/useForm/useFormComponent'
import useZxcvbn from '~/hooks/useZxcvbn'

import styles from './NewPasswordFieldset.module.scss'





const DEFAULT_MAX_LENGTH = 42



function NewPasswordFieldset (props) {
  const {
    onValidate: parentValidate,
    displayName = 'Password',
    maxLength = DEFAULT_MAX_LENGTH,
    name,
    ...inputProps
  } = props

  const nameRef = useRef(name)

  const ctxRef = useRef(null)
  ctxRef.current = useFormContext()

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [zxcvbn, zxcvbnLoading] = useZxcvbn()

  const handleValidate = useValidationCallback(
    (messages, value) => {
      if (value.match(/[@&+%~\s]/gu)) {
        messages.errors.push(`${displayName} must not contain "@", "$", "%", "+", or spaces due to limitations in IRC.`)
      }

      if (value.length > maxLength) {
        messages.errors.push(`${displayName} must be no more than ${maxLength} characters long due to limitations in IRC.`)
      }

      if (zxcvbn) {
        const evaluation = zxcvbn(value)

        if (evaluation.feedback.warning) {
          messages.errors.push(evaluation.feedback.warning)
        }

        messages.warnings.push(...evaluation.feedback.suggestions)

        setPasswordStrength(evaluation.score)
      } else if (zxcvbnLoading) {
        messages.errors.push('Password evaluation is loading...')
      }
    },
    [displayName, maxLength, zxcvbn, zxcvbnLoading],
    parentValidate,
  )

  useEffect(() => {
    if (zxcvbn) {
      ctxRef.current?.validateField(
        nameRef.current,
        _get(ctxRef.current?.ctx.state, nameRef.current),
      )
    }
  }, [zxcvbn])

  return (
    <PasswordFieldset
      autoComplete="new-password"
      className={styles.newPasswordInput}
      displayName={displayName}
      minLength={12}
      name={name}
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
  ...fieldPropTypes,
}





export default NewPasswordFieldset
