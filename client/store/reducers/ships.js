import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function shipsReducer (state = initialState.ships, action) {
  const {
    payload,
    status,
    type,
  } = action
  const {
    ships,
    retrieving,
    total,
  } = state

  switch (type) {
    case actionTypes.GET_USER:
      switch (status) {
        case 'success':
          return {
            ...state,
            ships: {
              ...ships,
              ...parseJSONAPIResponseForEntityType(payload, 'ships', true),
            },
            retrieving: false,
            total: action.total,
          }

        default:
          return {
            ...state,
            ships,
            retrieving,
            total,
          }
      }

    default:
      return state
  }
}
