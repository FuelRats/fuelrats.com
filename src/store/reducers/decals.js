import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const decalsReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.decals.read:
      if (status === 'success' && payload.eligible) {
        draftState.eligible = true
      }
      break

    default:
      break
  }
}, initialState.decals)





export default decalsReducer
