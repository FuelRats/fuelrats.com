// Module imports
import localForage from 'localforage'


// Component imports
import { createAction } from '../actionCreators'
import actionTypes from '../actionTypes'
import initialState from '../initialState'

// Component constants
const STORE_CART = 'STORE_CART'

export const getStoreCart = () => createAction({
  actionType: actionTypes.GET_CART,
  actionFunction: async () => {
    const cart = await localForage.getItem(STORE_CART) || { ...initialState.storeCart }


    return cart
  },
})

export const updateCartItem = ({ id, quantity }) => createAction({
  actionType: actionTypes.UPDATE_CART_ITEM,
  actionFunction: async () => {
    const cart = await localForage.getItem(STORE_CART) || { ...initialState.storeCart }

    if (quantity < 1) {
      delete cart[id]
    } else {
      cart[id] = quantity
    }

    await localForage.setItem(STORE_CART, cart)
    return cart
  },
})

export const removeCartItem = ({ id }) => createAction({
  actionType: actionTypes.DELETE_CART_ITEM,
  actionFunction: async () => {
    const cart = await localForage.getItem(STORE_CART) || { ...initialState.storeCart }

    delete cart[id]

    await localForage.setItem(STORE_CART, cart)
    return cart
  },
})

export const clearCart = () => createAction({
  actionType: actionTypes.CLEAR_CART,
  actionFunction: async () => {
    await localForage.setItem(STORE_CART, { ...initialState.storeCart })
    return { ...initialState.storeCart }
  },
})
