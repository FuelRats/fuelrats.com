// Module imports
import localForage from 'localforage'


// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'
import actionStatus from '../actionStatus'





// Component constants
const STORE_CART = 'STORE_CART'





const getStoreCart = () => async (dispatch) => {
  const cart = await localForage.getItem(STORE_CART) || { ...initialState.storeCart }

  return dispatch({
    type: actionTypes.GET_CART,
    payload: cart,
    status: actionStatus.SUCCESS,
  })
}

const updateCartItem = ({ id, quantity }) => async (dispatch) => {
  const cart = await localForage.getItem(STORE_CART) || { ...initialState.storeCart }

  if (quantity < 1) {
    delete cart[id]
  } else {
    cart[id] = quantity
  }

  await localForage.setItem(STORE_CART, cart)

  return dispatch({
    type: actionTypes.UPDATE_CART_ITEM,
    payload: {
      id,
      quantity,
    },
    status: actionStatus.SUCCESS,
  })
}

const removeCartItem = ({ id }) => async (dispatch) => {
  const cart = await localForage.getItem(STORE_CART) || { ...initialState.storeCart }

  delete cart[id]

  await localForage.setItem(STORE_CART, cart)

  return dispatch({
    type: actionTypes.DELETE_CART_ITEM,
    payload: { id },
    status: actionStatus.SUCCESS,
  })
}

const clearCart = () => async (dispatch) => {
  await localForage.setItem(STORE_CART, { ...initialState.storeCart })

  return dispatch({
    type: actionTypes.CLEAR_CART,
    status: actionStatus.SUCCESS,
  })
}





export {
  getStoreCart,
  updateCartItem,
  removeCartItem,
  clearCart,
}
