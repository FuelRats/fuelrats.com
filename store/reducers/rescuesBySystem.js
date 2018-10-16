import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function rescuesBySystemReducer (state = initialState.rescuesBySystem, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_RESCUES_BY_SYSTEM:
      switch (status) {
        case 'success':
          return {
            ...state,
            loading: false,
            statistics: payload.data,
          }

        case 'error':
          return {
            ...state,
            loading: false,
            statistics: [],
          }

        default:
          return {
            ...state,
            loading: true,
          }
      }

    default:
      return state
  }
}
