import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function ordersReducer (state = initialState.orders, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_STRIPE_ORDERS:
      if (status === 'success') {
        return {
          orders: {
            ...state.orders,
            ...payload.data.reduce((acc, order) => ({
              ...acc,
              [order.id]: order,
            }), {}),
          },
        }
      }
      break


    case actionTypes.GET_STRIPE_ORDER:
    case actionTypes.UPDATE_STRIPE_ORDER:
    case actionTypes.CREATE_STRIPE_ORDER:
      if (status === 'success') {
        return {
          orders: {
            ...state.orders,
            [payload.data.id]: payload.data,
          },
        }
      }
      break

    default:
      break
  }

  return state
}
