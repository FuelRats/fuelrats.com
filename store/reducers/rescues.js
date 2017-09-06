import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.rescues, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
    case actionTypes.RETRIEVE_PAPERWORK:
    case actionTypes.SUBMIT_PAPERWORK:
      let {
        rescues,
        retrieving,
        total,
      } = state

      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            rescues: parseJSONAPIResponseForEntityType(payload, 'rescues'),
            retrieving: false,
            total: action.total,
          })

        default:
          return Object.assign({}, state, {
            rescues,
            retrieving,
            total,
          })
      }

    default:
      return state
  }
}
