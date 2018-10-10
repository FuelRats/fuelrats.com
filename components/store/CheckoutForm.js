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



// Component constants
const INVALID_CARD_MESSAGE = 'Credit Card is Required'
const INVALID_CARDHOLDER_NAME_MESSAGE = 'Cardholder name is Required'
const INVALID_INFO_MESSAGE = 'Shipping info is Required'
const INVALID_SHIPPING_METHOD_MESSAGE = 'Select a shipment method'



@injectStripe
@connect
class CheckoutForm extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    cardName: '',
    cardToken: null,
    customerInfo: {
      value: {},
      valid: INVALID_INFO_MESSAGE,
    },
    error: null,
    loading: true,
    order: null,
    stage: 0, // 0=customer info, 1=shipping, 2=review & billing, 3=confirmation
    submitting: false,
    shippingMethod: '',
    cardValidity: INVALID_CARD_MESSAGE,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleCardElementChange = event => {
    this.setState({ cardValidity: event.complete || (event.error ? event.error.message : INVALID_CARD_MESSAGE) })
  }

  _handleCustomerInfoChange = customerInfo => {
    this.setState({ customerInfo })
  }

  _handleCardNameChange = ({ target }) => {
    this.setState({ cardName: target.value })
  }

  _handleOrderCreate = async event => {
    event.preventDefault()

    const {
      cardName,
      cart,
      createOrder,
      stripe,
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
      const { token, error } = await stripe.createToken({ name: cardName })

      if (!error) {
        sessionStorage.setItem('currentOrder', payload.data.id)
        await localForage.setItem('lastStage', 1)
        this.setState({
          error: null,
          cardToken: token,
          order: payload.data,
          shippingMethod: payload.data.attributes.shippingMethod,
          stage: 1,
          submitting: false,
        })
      } else {
        this.setState({ error: error.message })
      }
    } else {
      this.setState({ error: 'Error while creating order.' })
    }
  }

  _handleShippingMethodChange = event => {
    this.setState({ shippingMethod: event.key })
  }

  _handleShippingMethodConfirm = async event => {
    event.preventDefault()

    const { updateOrder } = this.props
    const {
      order,
      shippingMethod,
    } = this.state

    if (shippingMethod !== order.attributes.shippingMethod) {
      this.setState({ submitting: true })

      const { payload, status } = await updateOrder(order.id, {
        selected_shipping_method: shippingMethod,
      })

      if (status === 'success') {
        await localForage.setItem('lastStage', 2)
        this.setState({
          error: null,
          order: payload.data,
          stage: 2,
          submitting: false,
        })
      } else {
        this.setState({
          error: 'Error while changing shipping method.',
          submitting: false,
        })
      }
    } else {
      await localForage.setItem('lastStage', 2)
      this.setState({
        error: null,
        stage: 2,
      })
    }
  }

  _handleOrderConfirm = async event => {
    event.preventDefault()

    const {
      clearCart,
      payOrder,
      stripe,
    } = this.props
    let {
      cardName,
      cardToken,
      order,
    } = this.state

    this.setState({ submitting: true })

    if (!cardToken) {
      const { token, error } = await stripe.createToken({ name: cardName })

      if (!error) {
        cardToken = token
      } else {
        this.setState({ error: error.message, submitting: false })
        return
      }
    }

    const { payload, status } = await payOrder(order.id, {
      source: cardToken.id,
    })

    if (status === 'success') {
      await clearCart()
      sessionStorage.removeItem('currentOrder')
      await localForage.removeItem('lastStage')
      this.setState({
        error: null,
        order: payload.data,
        stage: 3,
        submitting: false,
      })
    } else {
      this.setState({
        error: payload.errors && payload.errors.length ? `Error: ${payload.errors[0].detail.message}` : 'Error while submitting order.',
        cardToken: null,
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
      stage: order ? (lastStage || 1) : 0,
    })
  }

  render () {
    const {
      skus,
    } = this.props

    const {
      cardName,
      cardToken,
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
          } else if (stage === 0) {
            <form className="compact" onSubmit={this._handleOrderCreate}>
              <h4>Billing Info</h4>
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
              <br />
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
          } else if (stage === 1) {
            <form className="compact center" onSubmit={this._handleShippingMethodConfirm}>
              <h4>Shipping Method</h4>
              <fieldset>
                <RadioCardInput
                  value={shippingMethod}
                  onChange={this._handleShippingMethodChange}
                  options={order.attributes.shippingMethods.map(method => ({
                    key: method.id,
                    disabled: method.description.startsWith('UK Domestic') && order.attributes.shipping.address.country !== 'United Kingdom',
                    value: { ...method },
                  }))}>
                  {({ value }) => (
                    <>
                      <span className="title">{value.description}</span>
                      <span>
                        {(value.amount / 100).toLocaleString('en-GB', {
                          style: 'currency',
                          currency: value.currency,
                          currencyDisplay: 'symbol',
                        })}
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
          } else if (stage === 2) {
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
                    {order.attributes.items.map(item => {
                      const sku = skus[item.parent]
                      const descriptors = (sku && Object.keys(sku.attributes.attributes).length) ? Object.values(sku.attributes.attributes)[0] : null
                      return (
                        <tr key={item.parent}>
                          <td className="text-right text-space-right">{item.quantity && `${item.quantity}x `}{item.description}{descriptors && ` (${descriptors})`}</td>
                          <td>{
                            (item.amount / 100).toLocaleString('en-GB', {
                              style: 'currency',
                              currency: order.attributes.currency,
                              currencyDisplay: 'symbol',
                            })}
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td className="text-bold text-right">Total</td>
                      <td className="text-bold total">
                        {
                          (order.attributes.amount / 100).toLocaleString('en-GB', {
                            style: 'currency',
                            currency: order.attributes.currency,
                            currencyDisplay: 'symbol',
                          })
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <form className="compact center" onSubmit={this._handleOrderConfirm}>
                {!cardToken && (
                  <>
                    <h4>Billing Info</h4>
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
                  </>
                )}
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
          } else if (stage === 3) {
            <>
              <h2>Success!</h2>
              <span>Your Order has been submitted. Be sure to check your email for confirmation!</span>
              <span>Once our quartermaster ships your order, you will receive a shipment confirmation email.</span>
              <span>Please note that only larger items sent by parcel have tracking numbers; smaller items like stickers and badges are sent as normal mail, but we'll still let you know when it's shipped!</span>
              <span>If you have any questions or concerns, please contact us at <a href="mailto:orders@fuelrats.com">orders@fuelrats.com</a>. You can find our return and cancellation policy in your order confirmation email.</span>
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
        if (cardName === '') {
          return INVALID_CARDHOLDER_NAME_MESSAGE
        }
        if (cardValidity !== true) {
          return cardValidity
        }
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
