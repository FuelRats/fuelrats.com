// Module imports
import React from 'react'
import moment from 'moment'





// Component imports
import { actions, connect } from '../../store'
// import { Link } from '../../routes'
import { authenticated } from '../../components/AppLayout'
import Component from '../../components/Component'
import OrderStatusIndicator from '../../components/storefront/OrderStatusIndicator'
import PageWrapper from '../../components/PageWrapper'
import FulfillOrderDialog from '../../components/storefront/FulfillOrderDialog'




@authenticated('order.read')
@connect
class ListOrders extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    activeOrder: null,
    showFullfillDialog: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleFullfillButtonClick = (event) => {
    const { name: orderId } = event.target

    this.setState({
      showFullfillDialog: true,
      activeOrder: orderId,
    })
  }

  _handleFullfillDialogComplete = () => {
    this.setState({ showFullfillDialog: false })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ store }) {
    await Promise.all([
      actions.getProducts()(store.dispatch),
      actions.getOrders({ status: 'paid' })(store.dispatch),
      actions.getOrders({ status: 'created' })(store.dispatch),
    ])
  }

  render () {
    const {
      orders,
      skus,
    } = this.props

    const {
      activeOrder,
      showFullfillDialog,
    } = this.state

    return (
      <>
        <PageWrapper title="Orders">
          <div className="page-content">
            <table className="striped padded">
              <thead>
                <tr>
                  <th>Order Date</th>

                  <th>Status</th>

                  <th>Contents</th>

                  <th>Shipping Via</th>

                  <th>Destination</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{moment(order.attributes.createdAt).format('DD MMMM, YYYY')}</td>

                    <td>
                      <OrderStatusIndicator status={order.attributes.status} />
                      {order.attributes.status === 'paid' && (
                        <button
                          className="compact"
                          name={order.id}
                          onClick={this._handleFullfillButtonClick}
                          type="button">
                          Fulfill
                        </button>
                      )}
                    </td>

                    <td>
                      <ul>
                        {order.attributes.items.filter(({ type }) => (type === 'sku')).map((item) => {
                          const sku = skus[item.parent]
                          const descriptors = Object.keys(sku.attributes.attributes).length ? Object.values(sku.attributes.attributes).join(', ') : null
                          return (
                            <li key={item.parent}>
                              {item.quantity}x {item.description} {descriptors && `(${descriptors})`}
                            </li>
                          )
                        })}
                      </ul>
                    </td>

                    <td>
                      {!order.attributes.shipping.carrier && (
                        'TBD'
                      )}
                      {Boolean(order.attributes.shipping.carrier) && (
                        <>
                          {order.attributes.shipping.carrier}<br />
                          {order.attributes.shipping.tracking_number}
                        </>
                      )}
                    </td>

                    <td>
                      <address>
                        <span className="name">{order.attributes.shipping.name}</span>
                        <span className="line1">{order.attributes.shipping.address.line1}</span>
                        <span className="line2">{order.attributes.shipping.address.line2}</span>
                        <span className="city">{order.attributes.shipping.address.city}, </span>
                        <span className="state">{order.attributes.shipping.address.state}, </span>
                        <span className="country">{order.attributes.shipping.address.country}</span>
                        <span className="zip">{order.attributes.shipping.address.postal_code}</span>
                      </address>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageWrapper>
        {showFullfillDialog && (
          <FulfillOrderDialog
            onClose={this._handleFullfillDialogComplete}
            orderId={activeOrder} />
        )}
      </>
    )
  }

  static mapDispatchToProps = ['getOrders', 'updateOrder']

  static mapStateToProps = ({ orders: { orders }, skus }) => {
    const paidOrders = Object.values(orders).filter((order) => order.attributes.status === 'paid').reverse()
    const createdOrders = Object.values(orders).filter((order) => order.attributes.status === 'created')

    return {
      orders: [
        ...paidOrders,
        ...createdOrders,
      ],
      skus,
    }
  }
}





export default ListOrders
