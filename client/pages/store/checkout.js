// Module imports
import React from 'react'
// import { Elements } from 'react-stripe-elements'





// Component imports
import { actions, connect } from '../../store'
import { PageWrapper, withStripe } from '../../components/AppLayout'
import { selectStoreCart } from '../../store/selectors'





@connect
@withStripe
class Checkout extends React.Component {
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
    return (
      <PageWrapper title="Your Cart">
        <div className="page-content">
          <h4> We said the store was closed. Why are you here? </h4>
        </div>
      </PageWrapper>
    )
  }




  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getStoreCart']

  static mapStateToProps = (state) => ({ cart: selectStoreCart(state) })
}





export default Checkout
