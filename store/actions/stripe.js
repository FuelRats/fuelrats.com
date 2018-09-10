// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const getProducts = params => createApiAction({
  actionType: actionTypes.GET_STRIPE_PRODUCTS,
  url: '/products',
  params,
})





export const getProduct = id => createApiAction({
  actionType: actionTypes.GET_STRIPE_PRODUCT,
  url: `/products/${id}`,
})





export const getOrders = params => createApiAction({
  actionType: actionTypes.GET_STRIPE_ORDERS,
  url: '/orders',
  params,
})





export const getOrder = id => createApiAction({
  actionType: actionTypes.GET_STRIPE_ORDER,
  url: `/orders/${id}`,
})





export const updateOrder = (id, changes) => createApiAction({
  actionType: actionTypes.UPDATE_STRIPE_ORDER,
  url: `/orders/${id}`,
  method: 'post',
  data: changes,
})
