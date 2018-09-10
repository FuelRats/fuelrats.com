import actionTypes from '../actionTypes'
import initialState from '../initialState'

export default function (state = initialState.products, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_STRIPE_PRODUCTS:
    case actionTypes.GET_STRIPE_PRODUCT:
      if (status === 'success') {
        return {
          products: {
            ...state.products,
            ...payload.data.reduce((acc, product) => ({
              ...acc,
              [product.id]: {
                ...product,
                attributes: {
                  ...product.attributes,
                  skus: product.attributes.skus ? product.attributes.skus.reduce((skuAcc, sku) => ({
                    ...skuAcc,
                    [sku.id]: sku,
                  }), {}) : {},
                },
              },
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
