import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.rescuesOverTime, action) {
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
            loading: false,
            statistics: payload,
          })

        case 'error':
          return Object.assign({}, state, {
            loading: false,
            statistics: [],
          })

        default:
          return Object.assign({}, state, {
            loading: true,
          })
      }

    default:
      return state
  }
}
