import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function epicsReducer (state = initialState.epics, action) {
  const {
    payload,
    status,
    type,
  } = action
  const {
    epics,
  } = state

  switch (type) {
    case actionTypes.RETRIEVE_EPIC:
    case actionTypes.CREATE_EPIC:
      switch (status) {
        case 'success':
          return {
            ...state,
            epics: {
              ...epics,
              ...parseJSONAPIResponseForEntityType(payload, 'epics', true),
            },
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
