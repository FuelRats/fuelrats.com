import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const skuPresenter = (sku) => {
  const {
    id,
    object,
    package_dimensions: packageDimensions,
    ...attributes
  } = sku

  return {
    id,
    type: object,
    attributes: {
      ...attributes,
      packageDimensions,
    },
  }
}


const skusReducer = produce((draftState, action) => {
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
          product.attributes.skus.forEach((sku) => {
            draftState[sku.id] = skuPresenter(sku)
          })
        })
      }
      break

    default:
      break
  }
}, initialState.skus)




export default skusReducer
