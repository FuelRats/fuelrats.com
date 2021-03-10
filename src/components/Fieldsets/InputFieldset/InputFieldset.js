import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'

import InputSuggestions from '~/components/InputMessages'
import extPropType from '~/helpers/extPropTypes'
import getValidityErrors from '~/helpers/getValidityErrors'
import useFocusState from '~/hooks/useFocusState'
import { useField, fieldPropTypes } from '~/hooks/useForm'
import useSharedForwardRef from '~/hooks/useSharedForwardRef'

import styles from './InputFieldset.module.scss'
import ValidityIcon from './ValidityIcon'





const InputFieldset = React.forwardRef((props, forwardRef) => {
  const {
    children,
    className,
    dark,
    displayName = 'Input',
    skipWarnings = false,
    inputClassName,
    label,
    patternMessage,
    onChange,
    onValidate: parentValidate,
    validateOpts,
    ...inputProps
  } = props

  const inputRef = useSharedForwardRef(forwardRef)

  const [messages, setMessages] = useState({ errors: [], warnings: [], valid: false })

  const [isFocused, onFocus, onBlur] = useFocusState()

  const handleValidate = useCallback(async (value = '') => {
    const target = inputRef.current

    // Get all error strings derived from browser-level validityState API
    const validityStateErrors = getValidityErrors(target, displayName)

    // Get all errors and warnings from the parent's validation method
    const { errors = [], warnings = [] } = (await parentValidate?.(value, target)) ?? {}

    // Browsers consider an input with only whitespace "filled", but we don't.
    if (props.required && target.value && target.value.replace(/[\s_]/gu, '') === '') {
      errors.push(`${displayName} is a required field.`)
    }

    // ensure validityState reflects our final validity.
    target.setCustomValidity(errors[0] ?? '')

    // Unless skipWarnings is passed, provide some default warnings for all inputs.
    if (!skipWarnings) {
      if (value.startsWith(' ')) {
        warnings.push(`Did you mean to start ${displayName} with a space?`)
      } else if (value.endsWith(' ')) {
        warnings.push(`Did you mean to end ${displayName} with a space?`)
      }
    }

    // Construct a validityResult object
    const result = {
      validatedValue: value,
      errors: [...validityStateErrors, ...errors],
      warnings,
      valid: validityStateErrors.length === 0 && errors.length === 0,
      hasMessages: validityStateErrors.length || errors.length || warnings.length,
    }

    // update state with our final result object
    setMessages(result)

    // return final validity state
    return result.valid
  }, [displayName, inputRef, parentValidate, props.required, skipWarnings])

  const {
    value = '',
    validating,
    submitting,
    handleChange,
  } = useField(props.name, { onValidate: handleValidate, onChange, validateOpts })

  const hideMessages = !messages?.validatedValue?.length || !messages?.hasMessages || validating || !isFocused

  return (
    <fieldset>

      {
        Boolean(label) && (
          <label htmlFor={props.id}>{label}</label>
        )
      }

      <div className={[styles.inputGroup, className]}>
        <input
          disabled={submitting}
          type="text"
          {...inputProps}
          ref={inputRef}
          className={[inputClassName, { dark }]}
          data-pattern-message={patternMessage}
          value={value}
          onBlur={onBlur}
          onChange={handleChange}
          onFocus={onFocus} />
        {children}
        <ValidityIcon
          hasMessages={messages?.hasMessages}
          required={props.required && !value.length}
          valid={messages?.valid}
          validating={validating} />
        <InputSuggestions
          className={{ dark, [styles.hidden]: hideMessages }}
          messages={messages} />
      </div>
    </fieldset>
  )
})

InputFieldset.displayName = 'InputFieldset'

InputFieldset.propTypes = {
  'aria-label': extPropType(PropTypes.string).isRequiredIf('label', 'undefined'),
  dark: PropTypes.bool,
  displayName: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  patternMessage: PropTypes.string,
  skipWarnings: PropTypes.bool,
  ...fieldPropTypes,
}


/**
 * Returns a memoized version of a callback which can accept the following arguments:
 *
 * * `messages` - an object containing two arrays of messages called `errors` and `warnings`
 * * `value` - The input value to validate against
 * * `target?` - the underlying input element
 *
 * `messages` can be mutated or an updated object can be returned by the callback.
 *
 * @param {Function} callback
 * @param {any[]} deps
 * @param {Function} parent
 * @returns {Function}
 */
function useValidationCallback (callback, deps = [], parent) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _callback = useCallback(callback, deps)

  return useCallback(
    async (...args) => {
      const { errors = [], warnings = [] } = (await parent?.(...args)) ?? {}
      return (await _callback({ errors, warnings }, ...args)) ?? { errors, warnings }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parent, _callback, ...deps],
  )
}





export default InputFieldset
export {
  useValidationCallback,
}
