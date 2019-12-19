// Module imports
import localForage from 'localforage'


// Component imports
import actionStatus from '../actionStatus'
import actionTypes from '../actionTypes'
import initialState from '../initialState'





// Component constants
const STORE_CART = 'STORE_CART'





const getStoreCart = () => async (dispatch) => {
  const cart = await localForage.getItem(STORE_CART) || { ...initialState.storeCart }

  return dispatch({
    type: actionTypes.stripe.cart.read,
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
    type: actionTypes.stripe.cart.updateItem,
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
    type: actionTypes.stripe.cart.deleteItem,
    payload: { id },
    status: actionStatus.SUCCESS,
  })
}

const clearCart = () => async (dispatch) => {
  await localForage.setItem(STORE_CART, { ...initialState.storeCart })

  return dispatch({
    type: actionTypes.stripe.cart.clear,
    status: actionStatus.SUCCESS,
  })
}





export {
  getStoreCart,
  updateCartItem,
  removeCartItem,
  clearCart,
}
