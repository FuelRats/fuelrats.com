import React from 'react'
import { Stripe } from 'stripe'

const env = require('../../../server/environment')

class DonatePaymentType extends React.Component {
  static noop () {
    return null
  }

  render () {
    const stripe = new Stripe(env.FRDC_STRIPE_API_SK)
    const session = (async () => {
      const _session = await stripe.checkout.sessions.create({
        // eslint-disable-next-line camelcase
        payment_method_types: ['card'],
        // eslint-disable-next-line camelcase
        line_items: [
          {
            name: 'Donation',
            description: `A donation of ${this.props.amount} ${this.props.currency}`,
            amount: this.props.amount * 100,
            currency: this.props.currency,
            quantity: 1,
          },
        ],
        // eslint-disable-next-line camelcase
        success_url: '',
        // eslint-disable-next-line camelcase
        cancel_url: '',
      })
      return _session
    })()

    console.log(session)

    return (
      <div>
        Your selected payment type is {this.props.type}, {this.props.currency}, {this.props.amount}
      </div>
    )
  }
}

export default DonatePaymentType
