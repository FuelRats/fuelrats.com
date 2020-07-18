import React from 'react'

import InputFieldset, { useValidationCallback } from './InputFieldset'





export default function CMDRFieldset (props) {
  const {
    onValidate: parentValidate,
    ...inputProps
  } = props

  const handleValidate = useValidationCallback(
    (messages, value) => {
      if (value.startsWith('CMDR')) {
        messages.errors.push('CMDR is redundant here, CMDR. Please input your name as you entered it when you chose your name in-game.')
      }

      if (value.includes('Surly Badger')) {
        messages.errors.push('You know... we\'re pretty sure you\'re not Surly!')
      }
    },
    [],
    parentValidate,
  )

  return (
    <InputFieldset
      displayName="CMDR Name"
      maxLength={42}
      placeholder="Surly Badger"
      {...inputProps}
      type="text"
      onValidate={handleValidate} />
  )
}
