import PropTypes from 'prop-types'
import { useMemo } from 'react'

import InputFieldset from '~/components/Fieldsets/InputFieldset'
import RadioFieldset from '~/components/Fieldsets/RadioFieldset'
import StripeBadge from '~/components/StripeBadge'
import getMoney from '~/helpers/getMoney'
import useForm from '~/hooks/useForm'





// Component Constants
const data = {
  currency: '',
  amountPreset: 0,
  amount: undefined,
}

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





function DonationForm (props) {
  const {
    className,
    onSubmit,
  } = props

  const { Form, canSubmit, state } = useForm({ data, onSubmit })

  const amountOptions = useMemo(() => {
    const [prefix] = (0).toLocaleString('en-US', { style: 'currency', currency: state.currency })
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
  }, [state.currency])

  const finalAmount = getMoney(state.amount * 100, state.currency)

  return (
    <Form className={['donate-form compact', className]}>
      <RadioFieldset
        required
        id="DonationCurrency"
        label="Select your currency"
        name="currency"
        options={currencyOptions} />

      <RadioFieldset
        required
        id="DonationAmountPreset"
        label="Select your amount"
        name="amountPreset"
        options={amountOptions} />

      {
        state.amountPreset === 'custom' && (
          <InputFieldset
            required
            id="DonationAmount"
            label="Input your custom amount"
            name="amount" />
        )
      }

      <div className="fieldset">
        <button
          className="green"
          disabled={!canSubmit}
          type="submit">
          {'Donate'}
          {Boolean(canSubmit) && ` ${finalAmount}`}
        </button>
      </div>

      <StripeBadge className="donation-info-badge" />
    </Form>
  )
}

DonationForm.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
}





export default DonationForm
