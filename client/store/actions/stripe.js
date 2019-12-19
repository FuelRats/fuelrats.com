// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





const getProduct = (id) => frApiRequest(
  actionTypes.stripe.products.read,
  { url: `/products/${id}` },
)

const getProducts = (params) => frApiRequest(
  actionTypes.stripe.products.search,
  {
    url: '/products',
    params: {
      active: true,
      type: 'good',
      ...params,
    },
  },
)





const createOrder = (data) => frApiRequest(
  actionTypes.stripe.orders.create,
  {
    url: '/orders',
    method: 'post',
    data,
  },
)

const getOrder = (id) => frApiRequest(
  actionTypes.stripe.orders.read,
  { url: `/orders/${id}` },
)

const getOrders = (params) => frApiRequest(
  actionTypes.stripe.orders.search,
  {
    url: '/orders',
    params,
  },
)

const payOrder = (id, data) => frApiRequest(
  actionTypes.stripe.orders.pay,
  {
    url: `/orders/${id}/pay`,
    method: 'put',
    data,
  },
)

const updateOrder = (id, data) => frApiRequest(
  actionTypes.stripe.orders.update,
  {
    url: `/orders/${id}`,
    method: 'put',
    data,
  },
)





export {
  getProduct,
  getProducts,
  createOrder,
  getOrder,
  getOrders,
  payOrder,
  updateOrder,
}
