// Component imports
import { actions, connect } from '../../store'
import { Link } from '../../routes'
import Component from '../../components/Component'
import PageWrapper from '../../components/PageWrapper'
import StoreControlBar from '../../components/storefront/StoreControlBar'

@connect
class ListCart extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    quantity: {},
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSKUUpdate = event => {
    const { name } = event.target
    const { quantity } = this.state
    const { updateCartItem } = this.props

    updateCartItem({
      id: name,
      quantity: Number(quantity[name]),
    })
  }

  _handleSKURemove = event => {
    const { name } = event.target
    const { removeCartItem } = this.props

    removeCartItem({ id: name })
  }

  _handleQuantityChange = event => {
    const {
      name,
      value,
    } = event.target
    let newValue = Number(event.target.value)

    if (newValue === this.props.cart[name]) {
      newValue = null
    }

    this.setState(state => ({
      quantity: {
        ...state.quantity,
        [name]: value,
      },
    }))
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ store }) {
    const state = store.getState()
    if (!Object.keys(state.products.products).length) {
      await actions.getProducts({ type: 'good' })(store.dispatch)
    }
  }

  async componentDidMount () {
    const {
      cart,
      getStoreCart,
    } = this.props

    if (!Object.keys(cart).length) {
      const { payload } = await getStoreCart()

      this.setState({
        quantity: payload,
      })
    } else {
      this.setState({
        quantity: cart,
      })
    }
  }

  render () {
    const {
      cart,
      products,
    } = this.props
    return (
      <>
        <PageWrapper title="Your Cart">
          <div className="page-content">
            <StoreControlBar backRoute="store list" backTooltip="Return to Products" />
            <div className="cart-items">
              <div className="cart-item key">
                <span className="item-name-key">Item</span>
                <span className="item-quantity-key">Quantity</span>
              </div>
              {Object.entries(cart).map(([skuId, quantity]) => {
                const product = Object.values(products).find(datum => datum.attributes.skus && datum.attributes.skus[skuId])
                const sku = product.attributes.skus[skuId]
                const {
                  name,
                } = product.attributes
                const {
                  attributes,
                  currency,
                  inventory,
                  price,
                } = sku

                return (
                  <div key={skuId} className="cart-item">
                    <span className="item-name">
                      <font className="name-quantity">{quantity}</font>
                      <font className="subscript">X</font>
                      {` ${name}: `}
                      {`${Object.values(attributes)[0]} `}
                      ( {((price * quantity) / 100).toLocaleString('en-GB', {
                        style: 'currency',
                        currency,
                        currencyDisplay: 'symbol',
                      })} )
                    </span>

                    <input
                      className="item-quantity"
                      name={skuId}
                      onChange={this._handleQuantityChange}
                      type="number"
                      min={0}
                      max={inventory.quantity}
                      value={this.state.quantity[skuId] || 0} />

                    <button
                      className="compact"
                      name={skuId}
                      onClick={this._handleSKUUpdate}
                      type="button">
                      Update
                    </button>

                    <button
                      className="compact"
                      name={skuId}
                      onClick={this._handleSKURemove}
                      type="button">
                      x
                    </button>
                  </div>
                )
              })}
              <div className="cart-item key">
                <span className="item-name-key this-exists-to-set-margins-cuz-clapton-is-lazy" />
                <span className="item-total-key">
                  {'SubTotal: '}
                  {
                    (Object.entries(cart).reduce((acc, [skuId, quantity]) => {
                      const product = Object.values(products).find(datum => datum.attributes.skus && datum.attributes.skus[skuId])
                      const sku = product.attributes.skus[skuId]

                      return acc + (sku.price * quantity)
                    }, 0) / 100).toLocaleString('en-GB', {
                      style: 'currency',
                      currency: 'EUR',
                      currencyDisplay: 'symbol',
                    })
                  }
                </span>
                {Boolean(Object.keys(cart).length) && (
                  <Link route="store checkout">
                    <a className="button compact">
                      Checkout
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </PageWrapper>
      </>
    )
  }

  static mapDispatchToProps = ['getStoreCart', 'updateCartItem', 'removeCartItem']

  static mapStateToProps = store => ({
    ...store.products,
    cart: store.storeCart,
  })
}





export default ListCart
