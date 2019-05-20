import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function shipsReducer (state = initialState.ships, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
    case actionTypes.GET_RAT:
    case actionTypes.GET_RATS:
    case actionTypes.UPDATE_RAT:
    case actionTypes.GET_SHIP:
    case actionTypes.GET_SHIPS:
    case actionTypes.CREATE_SHIP:
    case actionTypes.UPDATE_SHIP:
      if (status === 'success') {
        return {
          ...state,
          ...parseJSONAPIResponseForEntityType(payload, 'ships', true),
        }
      }
      break

    default:
      break
  }

  return state
}
