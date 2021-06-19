import RadioFieldset from '~/components/Fieldsets/RadioFieldset'





const currencyOptions = [
  {
    value: 'EUR',
    label: '€ EUR',
    title: 'Euro',
  },
  {
    value: 'GBP',
    label: '£ GBP',
    title: 'Great British Pounds',
  },
  {
    value: 'USD',
    label: '$ USD',
    title: 'United States Dollars',
  },
]





export default function CurrencyRadioFieldset (props) {
  return (
    <RadioFieldset
      {...props}
      options={currencyOptions} />
  )
}
