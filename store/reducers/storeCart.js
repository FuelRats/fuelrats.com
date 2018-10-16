import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function storeCartReducer (state = initialState.storeCart, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.CLEAR_CART:
    case actionTypes.DELETE_CART_ITEM:
    case actionTypes.GET_CART:
    case actionTypes.UPDATE_CART_ITEM:
      if (status === 'success') {
        return payload
      }
      break

    default:
      break
  }

  return state
}
