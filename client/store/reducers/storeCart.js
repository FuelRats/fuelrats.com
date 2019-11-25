import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const storeCartReducer = produce((draftState, action) => {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.CLEAR_CART:
    case actionTypes.DELETE_CART_ITEM:
    case actionTypes.GET_CART:
    case actionTypes.UPDATE_CART_ITEM:
      return payload

    default:
      break
  }

  return draftState
}, initialState.storeCart)




export default storeCartReducer
