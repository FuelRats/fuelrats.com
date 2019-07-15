// Module imports
import React from 'react'





// Component imports
import { actions, connect } from '../../store'
// import StoreControlBar from '../../components/storefront/StoreControlBar'
import CartUpdateDialog from '../../components/storefront/CartUpdateDialog'
import Component from '../../components/Component'
import PageWrapper from '../../components/PageWrapper'
import ProductCard from '../../components/storefront/ProductCard'
import productPriorityDecendingSort from '../../helpers/productPriorityDecendingSort'
import { selectProductsMeta, selectProducts } from '../../store/selectors'





@connect
class ListProducts extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = ListProducts.initialState





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleCartButtonClick = (product) => {
    this.setState({
      activeProduct: product,
      showDialog: true,
    })
  }

  _handleCartUpdateDialogClose = () => {
    this.setState(ListProducts.initialState)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ store }) {
    const state = store.getState()
    if (!Object.keys(state.products.products).length) {
      await actions.getProducts()(store.dispatch)
    }
  }

  render () {
    const {
      activeProduct,
      showDialog,
    } = this.state
    return (
      <>
        <PageWrapper title="Fuel Rats Merch">
          <div className="page-content">
            <h4 className="text-center">
              Due to an extended leave of our quartermaster, merch from this store is temporarily unavailable.
              <br />
              <br />
              Those with outstanding orders will have their orders fulfilled by the end of July. Apologies for the inconvenience.
              <br />
              <br />
              You can still buy our shirts on <a href="https://teespring.com/stores/fuelrats">Teespring</a>!
            </h4>
          </div>
          <div className="page-content force-disabled">
            <div className="product-cards">
              {Object.values(this.props.products).sort(productPriorityDecendingSort).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCartButtonClick={this._handleCartButtonClick} />
              ))}
            </div>
          </div>
        </PageWrapper>
        {showDialog && activeProduct && (
          <CartUpdateDialog
            product={activeProduct}
            onClose={this._handleCartUpdateDialogClose} />
        )}
      </>
    )
  }

  static get initialState () {
    return {
      activeProduct: null,
      showDialog: false,
    }
  }

  static mapStateToProps = (state) => ({
    ...selectProductsMeta(state),
    products: selectProducts(state),
  })
}





export default ListProducts
