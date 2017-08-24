import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.statistics, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_RESCUES_OVER_TIME:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            rescuesOverTime: payload,
          })

        default:
          return state
      }

    case actionTypes.GET_RESCUES_BY_SYSTEM:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            rescuesBySystem: payload,
          })

        default:
          return state
      }

    default:
      return state
  }
}
