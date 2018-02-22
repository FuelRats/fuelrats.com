import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.epics, action) {
  const {
    payload,
    status,
    type,
  } = action
  const {
    epics,
  } = state
  let newEpics

  switch (type) {
    case actionTypes.RETRIEVE_EPIC:
    case actionTypes.CREATE_EPIC:
      switch (status) {
        case 'success':
          newEpics = parseJSONAPIResponseForEntityType(payload, 'epics')

          for (const newEpic of newEpics) {
            const index = epics.findIndex(rescue => newEpic.id === rescue.id)

            if (index === -1) {
              epics.push(newEpic)
            } else {
              epics[index] = newEpic
            }
          }

          return {
            ...state,
            epics,
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
