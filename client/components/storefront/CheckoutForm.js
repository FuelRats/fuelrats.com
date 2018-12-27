// Module imports
import React from 'react'
import {
  CardElement,
  injectStripe,
} from 'react-stripe-elements'
import localForage from 'localforage'




// Component imports
import { connect } from '../../store'
import CustomerInfoFields from './CustomerInfoFields'
import RadioCardInput from '../RadioCardInput'
import ValidatedFormInput from '../ValidatedFormInput'
import StripeBadgeSvg from '../svg/StripeBadgeSvg'
import getMoney from '../../helpers/getMoney'

// Component constants
const INVALID_CARD_MESSAGE = 'Credit Card is Required'
const INVALID_CARDHOLDER_NAME_MESSAGE = 'Cardholder name is Required'
const INVALID_INFO_MESSAGE = 'Shipping info is Required'
const INVALID_SHIPPING_METHOD_MESSAGE = 'Select a shipment method'
const checkoutStage = {
  SHIPPING: 0,
  SHIP_METHOD: 1,
  BILLING: 2,
  SUCCESS: 3,
}



@injectStripe
@connect
class CheckoutForm extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    cardName: '',
    customerInfo: {
      value: {},
      valid: INVALID_INFO_MESSAGE,
    },
    error: null,
    loading: true,
    order: null,
    stage: checkoutStage.SHIPPING, // 0=SHIPPING, 1=SHIP_METHOD, 2=BILLING, 3=SUCCESS
    submitting: false,
    shippingMethod: '',
    cardValidity: INVALID_CARD_MESSAGE,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleCardElementChange = (event) => {
    this.setState({ cardValidity: event.complete || (event.error ? event.error.message : INVALID_CARD_MESSAGE) })
  }

  _handleCustomerInfoChange = (customerInfo) => {
    this.setState({ customerInfo })
  }

  _handleCardNameChange = ({ target }) => {
    this.setState({ cardName: target.value })
  }

  _handleOrderCreate = async (event) => {
    event.preventDefault()

    const {
      cart,
      createOrder,
    } = this.props
    const {
      customerInfo,
    } = this.state

    this.setState({ submitting: true })

    const { payload, status } = await createOrder({
      currency: 'eur',
      items: Object.entries(cart).reduce((acc, [parent, quantity]) => [...acc, { parent, quantity }], []),
      ...customerInfo.value,
    })


    if (status === 'success') {
      sessionStorage.setItem('currentOrder', payload.data.id)
      await localForage.setItem('lastStage', checkoutStage.SHIP_METHOD)
      this.setState({
        error: null,
        order: payload.data,
        shippingMethod: payload.data.attributes.shippingMethod,
        stage: checkoutStage.SHIP_METHOD,
        submitting: false,
      })
    } else {
      this.setState({ error: 'Error while creating order.' })
    }
  }

  _handleShippingMethodChange = (event) => {
    this.setState({ shippingMethod: event.key })
  }

  _handleShippingMethodConfirm = async (event) => {
    event.preventDefault()

    const { updateOrder } = this.props
    const {
      order,
      shippingMethod,
    } = this.state

    if (shippingMethod === order.attributes.shippingMethod) {
      await localForage.setItem('lastStage', checkoutStage.BILLING)
      this.setState({
        error: null,
        stage: checkoutStage.BILLING,
      })
    } else {
      this.setState({ submitting: true })

      const { payload, status } = await updateOrder(order.id, {
        selected_shipping_method: shippingMethod, /* eslint-disable-line camelcase */// Required by API
      })

      if (status === 'success') {
        await localForage.setItem('lastStage', checkoutStage.BILLING)
        this.setState({
          error: null,
          order: payload.data,
          stage: checkoutStage.BILLING,
          submitting: false,
        })
      } else {
        this.setState({
          error: 'Error while changing shipping method.',
          submitting: false,
        })
      }
    }
  }

  _handleOrderConfirm = async (event) => {
    event.preventDefault()

    const {
      clearCart,
      payOrder,
      stripe,
    } = this.props
    const {
      cardName,
      order,
    } = this.state

    this.setState({ submitting: true })

    const { token, error } = await stripe.createToken({ name: cardName })

    if (error) {
      this.setState({ error: error.message, submitting: false })
      return
    }

    const { payload, status } = await payOrder(order.id, {
      source: token.id,
    })

    if (status === 'success') {
      await clearCart()
      sessionStorage.removeItem('currentOrder')
      await localForage.removeItem('lastStage')
      this.setState({
        error: null,
        order: payload.data,
        stage: checkoutStage.SUCCESS,
        submitting: false,
      })
    } else {
      this.setState({
        error: payload.errors && payload.errors.length ? `Error: ${payload.errors[0].detail.message}` : 'Error while submitting order.',
        submitting: false,
      })
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const currentOrderId = sessionStorage.getItem('currentOrder')
    const lastStage = await localForage.getItem('lastStage')
    let order = null

    if (currentOrderId) {
      const { payload, status } = await this.props.getOrder(currentOrderId)

      if (status === 'success') {
        order = payload.data
      }
    }

    this.setState({
      loading: false,
      order,
      shippingMethod: order ? order.attributes.shippingMethod : '',
      stage: order ? (lastStage || checkoutStage.SHIP_METHOD) : checkoutStage.SHIPPING,
    })
  }

  render () {
    const {
      skus,
    } = this.props

    const {
      cardName,
      error,
      loading,
      order,
      stage,
      shippingMethod,
    } = this.state

    const stageIsValid = this.isValid

    return (
      <>
        {error && (
          <div className="store-errors">
            <div className="store-error">
              {error}
            </div>
          </div>
        )}
        {do {
          if (loading) {
            <h4>Loading...</h4>
          } else if (stage === checkoutStage.SHIPPING) {
            <form className="compact" onSubmit={this._handleOrderCreate}>
              <h4>Shipping Info</h4>
              <CustomerInfoFields onChange={this._handleCustomerInfoChange} />
              <br />
              <menu type="toolbar">
                <div className="primary">
                  <button
                    className="green"
                    disabled={stageIsValid !== true}
                    type="submit">
                    {stageIsValid === true ? 'Continue' : stageIsValid}
                  </button>
                </div>
                <div className="secondary" />
              </menu>
            </form>
          } else if (stage === checkoutStage.SHIP_METHOD) {
            <form className="compact center" onSubmit={this._handleShippingMethodConfirm}>
              <h4>Shipping Method</h4>
              <fieldset>
                <RadioCardInput
                  value={shippingMethod}
                  onChange={this._handleShippingMethodChange}
                  options={order.attributes.shippingMethods.map((method) => ({
                    key: method.id,
                    disabled: method.description.startsWith('UK Domestic') && order.attributes.shipping.address.country !== 'United Kingdom',
                    value: { ...method },
                  }))}>
                  {({ value }) => (
                    <>
                      <span className="title">{value.description}</span>
                      <span>
                        {getMoney(value.amount, value.currency)}
                      </span>
                    </>
                  )}
                </RadioCardInput>
              </fieldset>
              <menu type="toolbar">
                <div className="primary">
                  <button
                    className="green"
                    disabled={stageIsValid !== true}
                    type="submit">
                    {stageIsValid === true ? 'Continue' : stageIsValid}
                  </button>
                </div>
                <div className="secondary" />
              </menu>
            </form>
          } else if (stage === checkoutStage.BILLING) {
            <>
              <div className="order-details">
                <h4>Summary</h4>
                <table className="padded compact">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.attributes.items.map((item) => {
                      const sku = skus[item.parent]
                      const descriptors = (sku && Object.keys(sku.attributes.attributes).length) ? Object.values(sku.attributes.attributes).join(', ') : null
                      return (
                        <tr key={item.parent}>
                          <td className="text-right text-space-right">{item.quantity && `${item.quantity}x `}{item.description} {descriptors && `(${descriptors})`}</td>
                          <td>{getMoney(item.amount, order.attributes.currency)}
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td className="text-bold text-right">Total</td>
                      <td className="text-bold total">{getMoney(order.attributes.amount, order.attributes.currency)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br />
              <form className="compact center" onSubmit={this._handleOrderConfirm}>
                <fieldset>
                  <h4>
                    {'Billing Info '}
                    <a href="https://stripe.com/" style={{ float: 'right' }} target="_blank" rel="noopener noreferrer">
                      <StripeBadgeSvg style={{ verticalAlign: 'bottom' }} />
                    </a>
                  </h4>
                </fieldset>
                <ValidatedFormInput
                  autoComplete="cc-name"
                  id="name"
                  label="Cardholder Name"
                  name="name"
                  onChange={this._handleCardNameChange}
                  required
                  value={cardName} />
                <fieldset>
                  <CardElement onChange={this._handleCardElementChange} />
                </fieldset>
                <menu type="toolbar">
                  <div className="primary">
                    <button
                      className="green"
                      disabled={stageIsValid !== true}
                      type="submit">
                      {stageIsValid === true ? 'Submit Order' : stageIsValid}
                    </button>
                  </div>
                  <div className="secondary" />
                </menu>
              </form>
            </>
          } else if (stage === checkoutStage.SUCCESS) {
            <>
              <h2>Success!</h2>
              <span>Your Order has been submitted. Be sure to check your email for confirmation!</span>
              <span>Once our quartermaster ships your order, you will receive a shipment confirmation email.</span>
              <span>
                Please note that only larger items sent by parcel have tracking numbers;
                smaller items like stickers and badges are sent as normal mail, but we'll still let you know when it's shipped!
              </span>
              <span>
                If you have any questions or concerns, please contact us at <a href="mailto:orders@fuelrats.com">orders@fuelrats.com</a>.
                You can find our return and cancellation policy in your order confirmation email.
              </span>
            </>
          }
        }}
      </>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isValid () {
    const {
      cardName,
      cardValidity,
      customerInfo,
      shippingMethod,
      submitting,
      stage,
    } = this.state

    if (submitting) {
      return 'Submitting'
    }

    switch (stage) {
      case 0:
        if (customerInfo.valid !== true) {
          return customerInfo.valid
        }
        break

      case 1:
        if (!shippingMethod) {
          return INVALID_SHIPPING_METHOD_MESSAGE
        }
        break

      case 2:
        if (cardName === '') {
          return INVALID_CARDHOLDER_NAME_MESSAGE
        }
        if (cardValidity !== true) {
          return cardValidity
        }
        break

      default:
        break
    }



    return true
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['createOrder', 'getOrder', 'updateOrder', 'payOrder', 'clearCart']

  static mapStateToProps = ({ skus, storeCart }) => ({
    cart: storeCart,
    skus,
  })
}


export default CheckoutForm
