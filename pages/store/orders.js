// Module imports
import moment from 'moment'





// Component imports
import { actions, connect } from '../../store'
// import { Link } from '../../routes'
import { authenticated } from '../../components/AppLayout'
import Component from '../../components/Component'
import OrderStatusIndicator from '../../components/OrderStatusIndicator'
import PageWrapper from '../../components/PageWrapper'





@authenticated('order.read')
@connect
class ListOrders extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ store }) {
    await actions.getOrders()(store.dispatch)
  }

  render () {
    const {
      orders,
    } = this.props

    return (
      <PageWrapper title="Orders">
        <div className="page-content">
          <table>
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
              {Object.values(orders).map(order => (
                <tr key={order.id}>
                  <td>{moment(order.attributes.createdAt).format('DD MMMM, YYYY')}</td>

                  <td>
                    <OrderStatusIndicator status={order.attributes.status} />
                  </td>

                  <td>
                    <ul>
                      {order.attributes.items.filter(({ type }) => (type === 'sku')).map(item => (
                        <li key={item.description}>
                          {item.quantity}x {item.description}
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td>
                    {!order.attributes.shipping.carrier && (
                      'TBD'
                    )}
                    {!!order.attributes.shipping.carrier && (
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
    )
  }

  static mapDispatchToProps = ['getOrders', 'updateOrder']

  static mapStateToProps = ({ orders }) => orders
}





export default ListOrders
