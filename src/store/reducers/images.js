import { isError } from 'flux-standard-action'
import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default produce((draftState, action) => {
  const {
    payload,
    meta,
    type,
  } = action

  switch (type) {
    case actionTypes.images.dispose:
      if (!isError(action)) {
        delete draftState[meta.id]
      }
      break


    case actionTypes.images.read:
      if (!isError(action)) {
        draftState[meta.id] = payload
      }
      break

    default:
      break
  }
}, initialState.images)
