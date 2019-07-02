import React from 'react'


class DonatePaymentType extends React.Component {
  static noop () {
    return null
  }

  render () {
    return (
      <div>Your selected payment type is {this.props.type}, {this.props.currency}, {this.props.amount}</div>
    )
  }
}

export default DonatePaymentType
