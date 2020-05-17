import { produce } from 'immer'





import actionStatus from '../actionStatus'
import actionTypes from '../actionTypes'
import initialState from '../initialState'





const decalsReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.session.read:
      if (status === actionStatus.SUCCESS) {
        draftState.eligible = payload?.meta?.eligible
      }
      break

    default:
      break
  }
}, initialState.decals)





export default decalsReducer
