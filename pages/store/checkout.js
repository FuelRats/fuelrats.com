// Module imports
import { Elements } from 'react-stripe-elements'





// Component imports
import { actions, connect } from '../../store'
import { withStripe } from '../../components/AppLayout'
import StoreControlBar from '../../components/store/StoreControlBar'
import Component from '../../components/Component'
import CheckoutForm from '../../components/store/CheckoutForm'
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
      await actions.getProducts({ type: 'good' })(store.dispatch)
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
    return (
      <>
        <PageWrapper title="Your Cart">
          <div className="page-content">
            <StoreControlBar backRoute="store cart" backTitle="Return to Cart" />
            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </PageWrapper>
      </>
    )
  }

  static mapDispatchToProps = ['getStoreCart']

  static mapStateToProps = store => ({ cart: store.storeCart })
}





export default Checkout
