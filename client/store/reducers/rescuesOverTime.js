import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function rescuesOverTimeReducer (state = initialState.rescuesOverTime, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_RESCUES_OVER_TIME:
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
