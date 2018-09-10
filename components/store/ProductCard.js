// Module imports
import React from 'react'
import PropTypes from 'prop-types'





// Component imports
import Component from '../Component'





// Component constants
const currencyStringOptions = [
  'en-GB',
  {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol',
  },
]





class ProductCard extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleCartButtonClick = () => this.props.onCartButtonClick(this.props.product)





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render = () => {
    const {
      product,
    } = this.props

    const {
      images,
      name,
      caption,
      url,
      skus,
      metadata,
    } = product.attributes


    let priceRange = ''

    if (Object.keys(skus).length) {
      const priceList = Object.values(skus).map(sku => sku.price)
      const minPrice = Math.min(...priceList)
      const maxPrice = Math.max(...priceList)

      if (minPrice === maxPrice) {
        priceRange = `${(minPrice / 100).toLocaleString(...currencyStringOptions)}`
      } else {
        priceRange = `${(minPrice / 100).toLocaleString(...currencyStringOptions)} ~ ${(maxPrice / 100).toLocaleString(...currencyStringOptions)}`
      }
    }

    return (
      <div className="product-card">
        {images && images[0] && (
          <img src={images[0]} alt="product preview" />
        )}
        <span className="title">
          {name}
        </span>
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
                  onClick={this._handleCartButtonClick}
                  type="button">
                  Add to Cart
                </button>
              </>
            }
          }}
        </div>
      </div>
    )
  }





  static propTypes = {
    product: PropTypes.object.isRequired,
    onCartButtonClick: PropTypes.func.isRequired,
  }
}



export default ProductCard
