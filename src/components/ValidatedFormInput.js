import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'




function ValidatedFormInput (props) {
  const {
    as: Element = 'fieldset',
    children,
    doubleValidate = false,
    id,
    inputRef,
    invalidMessage = null,
    label,
    onChange = () => {},
    pattern = null,
    patternMessage = null,
    renderLabel = false,
    required,
    value,
    ...inputPassthrough
  } = props

  const [errorMessage, setErrorMessage] = useState('')
  const doubleValidateTimeout = useRef(null)

  const checkValidity = useCallback((target) => {
    let valid = true
    let message = ''

    if (!target.validity.valid) {
      valid = false
      message = invalidMessage || `${label} is invalid`
    }

    if (required && target.value === '') {
      valid = false
      message = `${label} is Required`
    }

    if (pattern && !target.value.match(pattern)) {
      valid = false
      message = patternMessage
    }

    setErrorMessage(message)
    return { target, valid, message }
  }, [invalidMessage, label, pattern, patternMessage, required])

  const handleChange = useCallback(({ target }) => {
    onChange(checkValidity(target))

    // Re-run validation on the next tick so Firefox reports the correct validity state.
    if (doubleValidate) {
      doubleValidateTimeout.current = setTimeout(() => {
        onChange(checkValidity(target))
      }, 1)
    }
  }, [onChange, checkValidity, doubleValidate])

  useEffect(() => {
    return () => {
      if (doubleValidateTimeout.current) {
        clearTimeout(doubleValidateTimeout.current)
      }
    }
  }, [])

  const inputProps = {
    ...inputPassthrough,
    id,
    pattern,
    required,
    value,
    name: inputPassthrough.name ?? id,
    ref: inputRef,
  }

  return (
    <Element className="validated-form-input">
      {renderLabel && <label htmlFor={id}>{label}</label>}
      <input
        placeholder={renderLabel ? undefined : label}
        {...inputProps}
        onChange={handleChange} />
      <div className={clsx('tooltiptext', { 'should-display': value && errorMessage })}>
        {errorMessage}
      </div>
      {children}
    </Element>
  )
}

ValidatedFormInput.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  doubleValidate: PropTypes.bool,
  id: PropTypes.string.isRequired,
  inputRef: PropTypes.any,
  invalidMessage: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  pattern: PropTypes.string,
  patternMessage: PropTypes.string,
  renderLabel: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string,
}


export default ValidatedFormInput
