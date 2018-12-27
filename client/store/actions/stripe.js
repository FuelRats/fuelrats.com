// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const getProducts = (params = {}) => createApiAction({
  actionType: actionTypes.GET_STRIPE_PRODUCTS,
  url: '/products',
  params: {
    active: true,
    type: 'good',
    ...params,
  },
})





export const getProduct = (id) => createApiAction({
  actionType: actionTypes.GET_STRIPE_PRODUCT,
  url: `/products/${id}`,
})





export const createOrder = (data) => createApiAction({
  actionType: actionTypes.CREATE_STRIPE_ORDER,
  url: '/orders',
  method: 'post',
  data,
})





export const getOrders = (params) => createApiAction({
  actionType: actionTypes.GET_STRIPE_ORDERS,
  url: '/orders',
  params,
})





export const getOrder = (id) => createApiAction({
  actionType: actionTypes.GET_STRIPE_ORDER,
  url: `/orders/${id}`,
})





export const payOrder = (id, data) => createApiAction({
  actionType: actionTypes.PAY_STRIPE_ORDER,
  url: `/orders/${id}/pay`,
  method: 'put',
  data,
})





export const updateOrder = (id, data) => createApiAction({
  actionType: actionTypes.UPDATE_STRIPE_ORDER,
  url: `/orders/${id}`,
  method: 'put',
  data,
})





export const createCustomer = (data) => createApiAction({
  actionType: actionTypes.CREATE_STRIPE_CUSTOMER,
  url: '/customers',
  method: 'post',
  data,
})
