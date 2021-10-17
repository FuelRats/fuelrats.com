import { useMemo } from 'react'

import RadioFieldset from '~/components/Fieldsets/RadioFieldset'





export default function AmountPresetRadioFieldset ({ currency, ...restProps }) {
  const amountOptions = useMemo(() => {
    const [prefix] = (0).toLocaleString('en-US', { style: 'currency', currency })
    return [
      {
        value: 'one',
        label: `${prefix}1.00`,
      },
      {
        value: 'five',
        label: `${prefix}5.00`,
      },
      {
        value: 'ten',
        label: `${prefix}10.00`,
      },
      {
        value: 'twenty',
        label: `${prefix}20.00`,
      },
      {
        value: 'custom',
        label: 'Custom Amount',
      },
    ]
  }, [currency]) ?? []

  return (
    <RadioFieldset
      {...restProps}
      options={amountOptions} />
  )
}
