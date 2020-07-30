import React, { useCallback } from 'react'

import InputFieldset, { useValidationCallback } from './InputFieldset'





export default function LoginTokenFieldset (props) {
  const { onChange: parentChange, onValidate: parentValidate, ...inputProps } = props
  const onChange = useCallback((event) => {
    parentChange?.(event)
    if (event.defaultPrevented) {
      return
    }
    event.target.value = event.target.value.toUpperCase().trim()
  }, [parentChange])

  const onValidate = useValidationCallback((messages, value) => {
    if (!value.match(/^[A-Z0-9]{6}$/u)) {
      messages.errors.push('Token should be 6 digits long and only contain letters and numbers.')
    }
  }, [], parentValidate)

  return (
    <InputFieldset
      displayName="Token"
      maxLength={6}
      minLength={6}
      {...inputProps}
      type="text"
      onChange={onChange}
      onValidate={onValidate} />
  )
}
