// Module imports
import React from 'react'





// Component imports
import { connect } from '../../store'
import Dialog from '../Dialog'
import Component from '../Component'
import isInStock from '../../helpers/isInStock'





// Component constants
const CONFIRMATION_DISPLAY_TIME = 1000
const currencyStringOptions = [
  'en-GB',
  {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol',
  },
]





@connect
class CartUpdateDialog extends Component {
  _handleQuantityChange = event => {
    this.setState({
      [event.target.name]: Number(event.target.value),
    })
  }

  _handleSKUChange = event => {
    const { cart } = this.props
    const activeSKU = event.target.value
    let quantity = 1

    if (cart[activeSKU]) {
      quantity = cart[activeSKU]
    }

    this.setState({
      activeSKU,
      quantity,
    })
  }

  _handleSubmit = async () => {
    const {
      activeSKU,
      quantity,
    } = this.state

    await this.props.updateCartItem({
      id: activeSKU,
      quantity,
    })

    this.setState({
      updateComplete: true,
    }, () => {
      setTimeout(this.props.onClose, CONFIRMATION_DISPLAY_TIME)
    })
  }

  constructor (props) {
    super(props)

    const firstSku = Object.values(this.props.product.attributes.skus).find(sku => isInStock(sku.inventory))

    this.state = {
      activeSKU: firstSku ? firstSku.id : '',
      quantity: firstSku && this.props.cart[firstSku.id] ? this.props.cart[firstSku.id] : 1,
      updateComplete: false,
    }
  }

  render () {
    const {
      product,
      onClose,
    } = this.props

    const {
      attributes: prodAttr,
      images,
      name,
      caption,
      skus,
    } = product.attributes

    const {
      updateComplete,
    } = this.state

    const activeSKU = this.state.activeSKU ? skus[this.state.activeSKU] : null

    return (
      <Dialog
        className="cart-update-dialog"
        controls={updateComplete ? undefined : this.controls}
        title="Add to Cart"
        onClose={onClose}>
        <div className="center-content">
          {do {
            if (!updateComplete) {
              <div className="product-card cart-view">
                {images && images[0] && (
                  <img src={images[0]} alt="product preview" />
                )}
                <span className="title">
                  {name}
                </span>
                <p>{caption}</p>
                <div className="controls">
                  {(prodAttr && prodAttr[0]) && (
                    <div className="labeled-input">
                      <label htmlFor="skuSelect">
                        {prodAttr[0].replace(/^\w/, char => char.toUpperCase())}:
                      </label>
                      <select
                        id="skuSelect"
                        name="activeSKU"
                        value={this.state.activeSKU}
                        onChange={this._handleSKUChange}>
                        {Object.values(skus).map(sku => {
                          const inStock = isInStock(sku.inventory)
                          return <option value={sku.id} key={sku.id} disabled={!inStock}>{sku.attributes[prodAttr[0]]} {!inStock && '(Sold Out!)'}</option>
                        })}
                      </select>
                    </div>
                  )}

                  <div className="labeled-input">
                    <label htmlFor="quantitySelect">Quantity:</label>
                    <input
                      disabled={activeSKU && !isInStock(activeSKU.inventory)}
                      id="quantitySelect"
                      name="quantity"
                      onChange={this._handleQuantityChange}
                      type="number"
                      min={0}
                      max={activeSKU.inventory.quantity || undefined}
                      value={this.state.quantity} />
                  </div>
                </div>
              </div>
            } else {
              <div>
                <h1>{product.attributes.name} Updated!</h1>
              </div>
            }
          }}
        </div>
      </Dialog>
    )
  }

  get controls () {
    const {
      cart,
      product,
    } = this.props
    const {
      activeSKU: aSKU,
      quantity,
    } = this.state

    const activeSKU = aSKU !== '' ? product.attributes.skus[aSKU] : null

    return {
      primary: [
        (
          <span>
            {
              activeSKU && quantity > 0
                ? `${quantity} @ ${(activeSKU.price / 100).toLocaleString(...currencyStringOptions)}${quantity > 1 ? ` = ${((activeSKU.price * quantity) / 100).toLocaleString(...currencyStringOptions)}` : ''}`
                : '€0.00'
            }
          </span>
        ),
        (
          <button
            disabled={
              !activeSKU
              || !isInStock(activeSKU.inventory)
              || (cart[aSKU] && cart[aSKU] === quantity)
              || (!cart[aSKU] && quantity < 1)
            }
            onClick={this._handleSubmit}
            type="button">
            {do {
              if (cart[aSKU]) {
                if (quantity < 1) {
                  'Remove'
                } else {
                  'Update'
                }
              } else {
                'Add'
              }
            }}
          </button>
        ),
      ],
    }
  }


  static mapDispatchToProps = ['updateCartItem']

  static mapStateToProps = state => ({ cart: state.storeCart })
}


export default CartUpdateDialog
