import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'



const skuPresenter = ({
  id,
  object,
  package_dimensions: packageDimensions,
  ...attributes
}) => ({
  id,
  type: object,
  attributes: {
    ...attributes,
    packageDimensions,
  },
})



export default function skusReducer (state = initialState.skus, action) {
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
          ...state,
          ...parseJSONAPIResponseForEntityType(payload, 'products').reduce((acc, product) => ({
            ...acc,
            ...product.attributes.skus.map(skuPresenter).reduce((skuacc, sku) => ({
              ...skuacc,
              [sku.id]: sku,
            }), {}),
          }), {}),
        }
      }
      break

    default:
      break
  }

  return state
}
