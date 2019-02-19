// Module imports
import React from 'react'





// Component imports
import { connect } from '../../store'
import Dialog from '../Dialog'
import Component from '../Component'
import isInStock from '../../helpers/isInStock'
import getMoney from '../../helpers/getMoney'





// Component constants
const CONFIRMATION_DISPLAY_TIME = 1000





@connect
class CartUpdateDialog extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleQuantityChange = (event) => {
    this.setState({
      [event.target.name]: Number(event.target.value),
    })
  }

  _handleSKUChange = (event) => {
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

    await this._cancelCurrentOrder()

    this.setState({
      updateComplete: true,
    }, () => {
      setTimeout(this.props.onClose, CONFIRMATION_DISPLAY_TIME)
    })
  }

  _cancelCurrentOrder = async () => {
    const { updateOrder } = this.props
    const currentOrder = sessionStorage.getItem('currentOrder')

    if (currentOrder) {
      await updateOrder(currentOrder, { status: 'canceled' })
      sessionStorage.removeItem('currentOrder')
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    const firstSku = Object.values(this.props.product.attributes.skus).find((sku) => isInStock(sku.inventory))

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
            if (updateComplete) {
              <div>
                <h1>{product.attributes.name} Updated!</h1>
              </div>
            } else {
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
                        {prodAttr[0].replace(/^\w/u, (char) => char.toUpperCase())}:
                      </label>
                      <div className="select-wrapper">
                        <select
                          id="skuSelect"
                          name="activeSKU"
                          value={this.state.activeSKU}
                          onChange={this._handleSKUChange}>
                          {Object.values(skus).map((sku) => {
                            const inStock = isInStock(sku.inventory)
                            return <option value={sku.id} key={sku.id} disabled={!inStock}>{sku.attributes[prodAttr[0]]} {!inStock && '(Sold Out!)'}</option>
                          })}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="labeled-input">
                    <label htmlFor="quantitySelect">Quantity:</label>
                    <input
                      aria-label="product quantity"
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
            }
          }}
        </div>
      </Dialog>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get controls () {
    const {
      cart,
      product,
    } = this.props
    const {
      activeSKU: aSKU,
      quantity,
    } = this.state

    const activeSKU = aSKU === '' ? null : product.attributes.skus[aSKU]

    return {
      primary: [
        (
          <span key="ItemTotal">
            {
              activeSKU && quantity > 0
                ? `${quantity} @ ${getMoney(activeSKU.price)}${quantity > 1 ? ` = ${getMoney(activeSKU.price * quantity)}` : ''}`
                : getMoney(0)
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
            key="UpdateButton"
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





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['updateCartItem', 'updateOrder']

  static mapStateToProps = (state) => ({ cart: state.storeCart })
}





export default CartUpdateDialog
