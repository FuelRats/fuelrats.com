// Module imports
import React from 'react'





// Component imports
import { actions, connect } from '../../store'
import StoreControlBar from '../../components/storefront/StoreControlBar'
import CartUpdateDialog from '../../components/storefront/CartUpdateDialog'
import Component from '../../components/Component'
import PageWrapper from '../../components/PageWrapper'
import ProductCard from '../../components/storefront/ProductCard'
import productPriorityDecendingSort from '../../helpers/productPriorityDecendingSort'





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
            <StoreControlBar />
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

  static mapStateToProps = (store) => store.products
}





export default ListProducts
