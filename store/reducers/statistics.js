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
    case actionTypes.GET_RESCUES_BY_RAT:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            loadingRescuesByRat: false,
            rescuesByRat: payload.data,
          })

        case 'error':
          return Object.assign({}, state, {
            loadingRescuesByRat: false,
            rescuesByRat: [],
          })

        default:
          return Object.assign({}, state, {
            loadingRescuesByRat: true,
          })
      }

    case actionTypes.GET_RESCUES_BY_SYSTEM:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            loadingRescuesBySystem: false,
            rescuesBySystem: payload,
          })

        case 'error':
          return Object.assign({}, state, {
            loadingRescuesBySystem: false,
            rescuesBySystem: [],
          })

        default:
          return Object.assign({}, state, {
            loadingRescuesBySystem: true,
          })
      }

    case actionTypes.GET_RESCUES_OVER_TIME:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            loadingRescuesOverTime: false,
            rescuesOverTime: payload,
          })

        case 'error':
          return Object.assign({}, state, {
            loadingRescuesOverTime: false,
            rescuesOverTime: [],
          })

        default:
          return Object.assign({}, state, {
            loadingRescuesOverTime: true,
          })
      }

    default:
      return state
  }
}
