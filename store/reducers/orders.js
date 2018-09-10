import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.orders, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_STRIPE_ORDERS:
    case actionTypes.GET_STRIPE_ORDER:
      if (status === 'success') {
        return {
          orders: {
            ...state,
            ...payload.data.reduce((acc, order) => ({
              ...acc,
              [order.id]: order,
            }), {}),
          },
        }
      }
      break

    default:
      break
  }

  return state
}
