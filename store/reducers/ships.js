import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.ships, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
      let {
        ships,
        retrieving,
        total,
      } = state

      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            ships: parseJSONAPIResponseForEntityType(payload, 'ships'),
            retrieving: false,
            total: action.total,
          })

        default:
          return Object.assign({}, state, {
            ships,
            retrieving,
            total,
          })
      }

    default:
      return state
  }
}
