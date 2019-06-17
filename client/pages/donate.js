// Module imports
import React from 'react'

// Component imports
import PageWrapper from '../components/PageWrapper'
import DonatePaymentType from '../components/Donate/DonatePaymentType'
import DonateSelectPaymentType from '../components/Donate/DonateSelectPaymentType'


class Donate extends React.Component {
    state = {
      hasSelectedType: false,
    }

    static noop () {
      return null
    }

    render () {
      const { hasSelectedType, paymentType, currency, amount } = this.state
      return (
        <PageWrapper title="Donate">
          <div className="page-content">
            {hasSelectedType
              ? <DonatePaymentType type={paymentType} currency={currency} amount={amount} />
              : <DonateSelectPaymentType />
            }
          </div>
        </PageWrapper>
      )
    }
}

export default Donate
