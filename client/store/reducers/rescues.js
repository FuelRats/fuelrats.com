import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function rescuesReducer (state = initialState.rescues, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
    case actionTypes.GET_RESCUE:
    case actionTypes.UPDATE_RESCUE:
      switch (status) {
        case 'success':
          return {
            ...state,
            ...parseJSONAPIResponseForEntityType(payload, 'rescues', true),
          }

        default:
          return state
      }

    default:
      return state
  }
}
