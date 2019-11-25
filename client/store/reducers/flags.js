import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const flagsReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.SET_FLAG:
      if (status === 'success') {
        return {
          ...draftState,
          ...payload,
        }
      }
      break

    default:
      break
  }

  return draftState
}, initialState.flags)




export default flagsReducer
