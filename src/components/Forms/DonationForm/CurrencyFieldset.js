import { useCallback } from 'react'

import InputFieldset from '~/components/Fieldsets/InputFieldset'





const currencyValidator = /^[0-9]{0,6}(\.[0-9]{0,2})?$/u





export default function CurrencyFieldset (props) {
  const {
    onChange: parentChange,
    ...inputProps
  } = props

  const onChange = useCallback(
    (event, value) => {
      if (!value.match(currencyValidator)) {
        event.preventDefault()
      }

      parentChange?.(event, value)
    },
    [parentChange],
  )

  return (
    <InputFieldset
      placeholder="0.00"
      {...inputProps}
      type="text"
      onChange={onChange} />
  )
}
