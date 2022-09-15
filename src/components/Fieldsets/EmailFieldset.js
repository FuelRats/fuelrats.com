import { forwardRef } from 'react'

import InputFieldset from './InputFieldset'





const EmailFieldset = forwardRef((props, ref) => {
  return (
    <InputFieldset
      ref={ref}
      displayName="E-Mail"
      placeholder="surly_badger@fuelrats.com"
      {...props}
      type="email" />
  )
})
EmailFieldset.displayName = 'EmailFieldset'





export default EmailFieldset
