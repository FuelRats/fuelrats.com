import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.rescues, action) {
  const {
    payload,
    status,
    type,
  } = action
  const {
    rescues,
  } = state
  let newRescues

  switch (type) {
    case actionTypes.GET_USER:
    case actionTypes.RETRIEVE_PAPERWORK:
    case actionTypes.SUBMIT_PAPERWORK:
      switch (status) {
        case 'success':
          newRescues = parseJSONAPIResponseForEntityType(payload, 'rescues')

          for (const newRescue of newRescues) {
            const index = rescues.findIndex(rescue => newRescue.id === rescue.id)

            if (index === -1) {
              rescues.push(newRescue)
            } else {
              rescues[index] = newRescue
            }
          }

          return {
            ...state,
            rescues,
            retrieving: false,
            total: action.total,
          }

        default:
          return state
      }

    default:
      return state
  }
}
