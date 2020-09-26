/* global $IS_DEVELOPMENT, $IS_STAGING */

import React, { forwardRef } from 'react'

import InputFieldset, { useValidationCallback } from './InputFieldset'


const isProduction = !$IS_DEVELOPMENT && !$IS_STAGING


const EmailFieldset = forwardRef((props, ref) => {
  const {
    onValidate: parentValidate,
    ...inputProps
  } = props

  const handleValidate = useValidationCallback(
    (messages, value) => {
      if (value === 'surly_badger@fuelrats.com') {
        messages.errors.push('While we appreciate your admiration for our founder, this email is most surely not your own.')
      } else if (isProduction && value.includes('@fuelrats')) {
        messages.errors.push('Fuel rats email accounts cannot be used to register a brand new account, goofball.')
      }
    },
    [],
    parentValidate,
  )

  return (
    <InputFieldset
      ref={ref}
      displayName="E-Mail"
      placeholder="surly_badger@fuelrats.com"
      {...inputProps}
      type="email"
      onValidate={handleValidate} />
  )
})
EmailFieldset.displayName = 'EmailFieldset'





export default EmailFieldset
