/* global $IS_DEVELOPMENT, $IS_STAGING */

import React, { forwardRef } from 'react'

import EmailFieldset from './EmailFieldset'
import { useValidationCallback } from './InputFieldset'


const isProduction = !$IS_DEVELOPMENT && !$IS_STAGING


const RegistrationEmailFieldset = forwardRef((props, ref) => {
  const {
    children,
    onValidate: parentValidate,
    ...inputProps
  } = props

  const handleValidate = useValidationCallback(
    (messages, value) => {
      const compareValue = value.toLowerCase().trim()
      if (compareValue === 'surly_badger@fuelrats.com') {
        messages.errors.push('While we appreciate your admiration for our founder, this email is most surely not your own.')
      } else if (isProduction && compareValue.includes('@fuelrats')) {
        messages.errors.push('Fuel rats email accounts cannot be used to register a brand new account, goofball.')
      }
    },
    [],
    parentValidate,
  )

  return (
    <EmailFieldset
      ref={ref}
      {...inputProps}
      onValidate={handleValidate}>
      {children}
    </EmailFieldset>
  )
})
RegistrationEmailFieldset.displayName = 'RegistrationEmailFieldset'





export default RegistrationEmailFieldset
