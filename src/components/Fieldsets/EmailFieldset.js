import React, { forwardRef } from 'react'

import InputFieldset from './InputFieldset'





const EmailFieldset = forwardRef((props, ref) => {
  const {
    ...inputProps
  } = props

  return (
    <InputFieldset
      ref={ref}
      displayName="E-Mail"
      placeholder="surly_badger@fuelrats.com"
      {...inputProps}
      type="email" />
  )
})
EmailFieldset.displayName = 'EmailFieldset'





export default EmailFieldset
