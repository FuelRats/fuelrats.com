import React from 'react'

import InputFieldset from './InputFieldset'





export default function LoginTokenFieldset (props) {
  return (
    <InputFieldset
      displayName="Token"
      maxLength={6}
      minLength={6}
      {...props}
      type="text" />
  )
}
