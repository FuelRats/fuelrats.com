import React from 'react'



import ValidatedCurrencySelect from '../ValidatedCurrencySelect'
import RadioCardInput from '../RadioCardInput'

const VALID_AMOUNTS = [
  {
    key: '1.0',
    value: 1.0,
  },
  {
    key: '5.0',
    value: 5.0,
  },
  {
    key: '10.0',
    value: 10.0,
  },
]

const INVALID_CURRENCY_MESSAGE = 'Currency is Required'

class DonateSelectPaymentType extends React.Component {
  state = {
    amount: 1.0,
    currency: '',
    validity: {
      currency: INVALID_CURRENCY_MESSAGE,
    },
  }

  _handleFieldChange = ({ target, valid, message }) => {
    this.setState(({ validity }) => {
      const {
        name,
        value,
      } = target
      const required = typeof validity[name] !== 'undefined'

      return {
        [name]: value,
        ...(required
          ? {
            validity: {
              ...validity,
              [name]: valid || message,
            },
          }
          : {}),
      }
    })
  }

  _handleAmountChange = (event) => {
    this.setState({
      amount: event.key,
    })
  }

  render () {
    const { currency, amount } = this.state
    return (
      <div className="">
        <h5>I want to donate</h5>
        <div>
          <RadioCardInput
            value={amount}
            onChange={this._handleAmountChange}
            options={
            VALID_AMOUNTS
            }>
            {({ value }) => (
              <>
                <span>
                  {value}
                </span>
              </>
            )}
          </RadioCardInput>
        </div>
        <div>
          <ValidatedCurrencySelect
            className="currency-input"
            disabled={this.props.submitting}
            id="donateCurrency"
            invalidMessage={INVALID_CURRENCY_MESSAGE}
            name="currency"
            label="Currency"
            onChange={this._handleFieldChange}
            required
            value={currency} />
        </div>
        <h5>with my</h5>
        <div>
          <button type="button" onClick={() => this.props.onTypeClick('card', currency)}>
            Credit card!
          </button>
          <button type="button" onClick={() => this.props.onTypeClick('aplgogl', currency)}>
            Apple / Google Pay!
          </button>
        </div>
      </div>
    )
  }
}

export default DonateSelectPaymentType
