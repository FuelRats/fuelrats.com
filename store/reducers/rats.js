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
    case actionTypes.GET_USER:
      let {
        rats,
        retrieving,
        total,
      } = state

      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            rats: parseJSONAPIResponseForEntityType(payload, 'rats'),
            retrieving: false,
            total: action.total,
          })

        default:
          return Object.assign({}, state, {
            rats,
            retrieving,
            total,
          })
      }

    default:
      return state
  }
}
