import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function leaderboardReducer (state = initialState.leaderboard, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_RAT_LEADERBOARD:
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
      break
  }

  return state
}
