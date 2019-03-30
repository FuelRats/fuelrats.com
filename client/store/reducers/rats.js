import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function ratsReducer (state = initialState.rats, action) {
  const {
    payload,
    status,
    type,
  } = action
  const { rats } = state

  switch (type) {
    case actionTypes.GET_USER:
    case actionTypes.GET_RESCUE:
    case actionTypes.CREATE_RAT:
    case actionTypes.UPDATE_RAT:
    case actionTypes.UPDATE_RESCUE:
      switch (status) {
        case 'success':
          return {
            ...state,
            rats: {
              ...rats,
              ...parseJSONAPIResponseForEntityType(payload, 'rats', true),
            },
            retrieving: false,
          }

        default:
          return state
      }

    default:
      return state
  }
}
