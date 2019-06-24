// Module imports
import React from 'react'

// Component imports
import PageWrapper from '../components/PageWrapper'
import DonatePaymentType from '../components/Donate/DonatePaymentType'
import DonateSelectPaymentType from '../components/Donate/DonateSelectPaymentType'


class Donate extends React.Component {
    state = {
      paymentType: null,
      currency: '',
      amount: null,
      submitting: false,
    }

    _handleTypeClick = (type, currency) => {
      this.setState({
        paymentType: type,
        currency,
      })
    }

    render () {
      const {
        paymentType, currency, amount, submitting,
      } = this.state
      return (
        <PageWrapper title="Donate" displayTitle="Donate to the Mischief">
          <div className="page-content">
            <p>
              Thank you for considering donating to The Fuel Rats. As simple as our jobs are in the end,
              we actually have a lot of systems in place to help us do our rescues,
              and the servers they run on amount to over €100 per month.
            </p>
            <p>
              We've got rats who have fronted the money to keep these servers running,
              but if you'd like to contribute, that would be great!
            </p>
            <p>
              Our donations are processed through Stripe, and they take most major credit cards.
            </p>
            {paymentType && currency !== ''
              ? (
                <DonatePaymentType
                  type={paymentType}
                  currency={currency}
                  amount={amount}
                  submitting={submitting} />
              )
              : (
                <DonateSelectPaymentType
                  type={paymentType}
                  currency={currency}
                  onTypeClick={this._handleTypeClick} />
              )
            }
          </div>
        </PageWrapper>
      )
    }
}

export default Donate
