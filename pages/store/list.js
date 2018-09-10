// Component imports
import { actions, connect } from '../../store'
import StoreControlBar from '../../components/store/StoreControlBar'
import CartUpdateDialog from '../../components/store/CartUpdateDialog'
import Component from '../../components/Component'
import PageWrapper from '../../components/PageWrapper'
import ProductCard from '../../components/store/ProductCard'


@connect
class ListProducts extends Component {
  state = ListProducts.initialState

  _showCartUpdateDialog = product => {
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
    await actions.getProducts({ type: 'good' })(store.dispatch)
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
              {Object.values(this.props.products).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCartButtonClick={this._showCartUpdateDialog} />
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

  static mapStateToProps = store => store.products
}





export default ListProducts
