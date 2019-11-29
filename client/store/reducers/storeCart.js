import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const storeCartReducer = produce((draftState, action) => {
  const {
    payload,
    type,
  } = action

  if (Object.values(actionTypes.stripe.cart).includes(type)) {
    return payload
  }

  return draftState
}, initialState.storeCart)




export default storeCartReducer
