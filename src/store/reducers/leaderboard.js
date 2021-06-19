import { isError } from 'flux-standard-action'
import { produce } from 'immer'

import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default produce((draftState, action) => {
  if (isError(action)) {
    return
  }

  switch (action.type) {
    case actionTypes.leaderboard.read:
      draftState.entries = action.payload.data
      draftState.statistics = action.payload.meta
      break

    default:
      break
  }
}, initialState.leaderboard)
