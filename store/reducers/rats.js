import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.rats, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.CREATE_RAT:
      switch (status) {
        case 'success':
          let {
            rats,
          } = state

          rats.push(action.rat)

          return Object.assign({}, state, {
            rats,
          })

        default:
          return state
      }

    case actionTypes.GET_USER:
    case actionTypes.RETRIEVE_PAPERWORK:
    case actionTypes.SUBMIT_PAPERWORK:
      switch (status) {
        case 'success':
          let {
            rats,
            retrieving,
            total,
          } = state

          return Object.assign({}, state, {
            rats: parseJSONAPIResponseForEntityType(payload, 'rats'),
            retrieving: false,
            total: action.total,
          })

        default:
          return state
      }

    default:
      return state
  }
}
