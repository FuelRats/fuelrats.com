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
          let newRescues = parseJSONAPIResponseForEntityType(payload, 'rescues')

          for (let newRescue of newRescues) {
            let index = rescues.findIndex(rescue => newRescue.id === rescue.id)

            if (index === -1) {
              rescues.push(newRescue)

            } else {
              rescues[index] = newRescue
            }
          }

          return Object.assign({}, state, {
            rescues: rescues,
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
