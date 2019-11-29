// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import { connect } from '../../store'
import skuIsInStock from '../../helpers/isInStock'
import getMoney from '../../helpers/getMoney'
import { selectProductById, selectSkusByProductId } from '../../store/selectors'




@connect
class ProductCard extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleCartButtonClick = () => this.props.onCartButtonClick(this.props.product)





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const { isInStock } = this

    const {
      product,
      productSkus,
    } = this.props

    const {
      images,
      name,
      caption,
      url,
      metadata,
    } = product.attributes


    let priceRange = ''

    if (productSkus.length) {
      const priceList = productSkus.map((sku) => sku.attributes.price)
      const minPrice = Math.min(...priceList)
      const maxPrice = Math.max(...priceList)

      if (minPrice === maxPrice) {
        priceRange = `${getMoney(minPrice)}`
      } else {
        priceRange = `${getMoney(minPrice)} ~ ${getMoney(maxPrice)}`
      }
    }


    return (
      <div className="product-card panel">
        {images && images[0] && (
          <div className="preview" style={{ backgroundImage: `url('${images[0]}')` }} />
        )}
        <header className="title">
          {name}
        </header>
        <p>{caption}</p>
        <div className="controls">
          {do {
            if (url) {
              <a className="button compact" href={url}>
                {metadata && (metadata.urlText || 'View Details')}
              </a>
            } else {
              <>
                <span>
                  {priceRange}
                </span>
                <button
                  className="compact"
                  disabled={!isInStock}
                  onClick={this._handleCartButtonClick}
                  type="button">
                  {isInStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </>
            }
          }}
        </div>
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isInStock () {
    const { productSkus } = this.props

    if (productSkus.length) {
      return productSkus.some((sku) => skuIsInStock(sku.attributes.inventory))
    }

    return false
  }



  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapStateToProps = (state, props) => ({
    product: selectProductById(state, props),
    productSkus: selectSkusByProductId(state, props),
  })



  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static propTypes = {
    onCartButtonClick: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
    /* eslint-disable-next-line react/no-unused-prop-types */// productId is used by mSTP
    productId: PropTypes.string.isRequired,
    productSkus: PropTypes.array.isRequired,
  }
}



export default ProductCard
