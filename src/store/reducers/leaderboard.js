import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const leaderboardReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.leaderboard.read:
      switch (status) {
        case 'success':
          draftState.loading = false
          draftState.statistics = payload.data
          break

        case 'error':
          draftState.loading = false
          draftState.statistics = []
          break

        default:
          draftState.loading = true
          break
      }
      break

    default:
      break
  }
}, initialState.leaderboard)





export default leaderboardReducer
