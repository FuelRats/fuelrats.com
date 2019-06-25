import React from 'react'
import ValidatedCurrencySelect from '../ValidatedCurrencySelect'


const INVALID_CURRENCY_MESSAGE = 'Currency is Required'

class DonateSelectPaymentType extends React.Component {
  state = {
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

  render () {
    const { currency } = this.state
    return (
      <div className="">
        <h5>I want to donate some</h5>
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
