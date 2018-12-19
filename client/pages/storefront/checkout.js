// Module imports
import React from 'react'
import { Elements } from 'react-stripe-elements'





// Component imports
import { actions, connect } from '../../store'
import { withStripe } from '../../components/AppLayout'
import StoreControlBar from '../../components/storefront/StoreControlBar'
import Component from '../../components/Component'
import CheckoutForm from '../../components/storefront/CheckoutForm'
import PageWrapper from '../../components/PageWrapper'





@connect
@withStripe
class Checkout extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ store }) {
    const state = store.getState()
    if (!Object.keys(state.products.products).length) {
      await actions.getProducts()(store.dispatch)
    }
  }

  componentDidMount () {
    const {
      cart,
      getStoreCart,
    } = this.props

    if (!Object.keys(cart).length) {
      getStoreCart()
    }
  }

  render () {
    const {
      cart,
    } = this.props
    return (
      <>
        <PageWrapper title="Your Cart">
          <div className="page-content">
            <StoreControlBar
              backRoute={Object.keys(cart).length ? 'store cart' : 'store list'}
              backTitle={Object.keys(cart).length ? 'Return to Cart' : 'Return to Store'} />
            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </PageWrapper>
      </>
    )
  }




  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getStoreCart']

  static mapStateToProps = (store) => ({ cart: store.storeCart })
}





export default Checkout
