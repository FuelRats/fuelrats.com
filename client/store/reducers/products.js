import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'


const productPresenter = (product) => {
  const {
    id,
    type,
    attributes: {
      skus,
      ...attributes
    },
  } = product

  return {
    id,
    type,
    attributes,
    relationships: {
      skus: {
        data: skus.map((sku) => ({ id: sku.id, type: sku.object })),
      },
    },
  }
}


const productsReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_STRIPE_PRODUCTS:
    case actionTypes.GET_STRIPE_PRODUCT:
      if (status === 'success') {
        const products = Array.isArray(payload.data)
          ? payload.data
          : [payload.data]

        products.forEach((product) => {
          draftState.products[product.id] = productPresenter(product)
        })
      }
      break

    default:
      break
  }
}, initialState.products)




export default productsReducer
