// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'





const getProduct = (id) => frApiRequest(
  actionTypes.GET_STRIPE_PRODUCT,
  { url: `/products/${id}` }
)

const getProducts = (params) => frApiRequest(
  actionTypes.GET_STRIPE_PRODUCTS,
  {
    url: '/products',
    params: {
      active: true,
      type: 'good',
      ...params,
    },
  }
)





const createOrder = (data) => frApiRequest(
  actionTypes.CREATE_STRIPE_ORDER,
  {
    url: '/orders',
    method: 'post',
    data,
  }
)

const getOrder = (id) => frApiRequest(
  actionTypes.GET_STRIPE_ORDER,
  { url: `/orders/${id}` }
)

const getOrders = (params) => frApiRequest(
  actionTypes.GET_STRIPE_ORDERS,
  {
    url: '/orders',
    params,
  }
)

const payOrder = (id, data) => frApiRequest(
  actionTypes.PAY_STRIPE_ORDER,
  {
    url: `/orders/${id}/pay`,
    method: 'put',
    data,
  }
)

const updateOrder = (id, data) => frApiRequest(
  actionTypes.UPDATE_STRIPE_ORDER,
  {
    url: `/orders/${id}`,
    method: 'put',
    data,
  }
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
