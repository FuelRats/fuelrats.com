// Module imports
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Component imports
import { connect } from '../../store'
import { Link } from '../../routes'
import Component from '../Component'




@connect
class StoreControlBar extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

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
      backRoute,
      backTitle,
      cart,
    } = this.props

    const totalItems = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0)
    return (
      <div className="store-control-bar">
        {Boolean(backRoute) && (
          <Link route={backRoute}>
            <a className="back-button icon" title={backTitle}>
              <FontAwesomeIcon icon="arrow-left" size="2x" />
            </a>
          </Link>
        )

        }
        {Boolean(totalItems) && (
          <Link route="store checkout">
            <a
              className="button compact"
              title="Proceed to Checkout">
              Checkout
            </a>
          </Link>
        )}
        <Link route="store cart">
          <a className="cart-button icon">
            <FontAwesomeIcon icon="shopping-cart" fixedWidth size="2x" />
            <span className="icon-badge grey">{totalItems}</span>
          </a>
        </Link>
      </div>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/
  static mapDispatchToProps = ['getStoreCart']

  static mapStateToProps = (state) => ({ cart: state.storeCart })
}


export default StoreControlBar
