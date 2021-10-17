import { isError } from 'flux-standard-action'
import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default produce((draftState, action) => {
  const {
    payload,
    type,
  } = action

  switch (type) {
    case actionTypes.session.setFlag:
      if (!isError(action)) {
        Object.assign(draftState, payload)
      }
      break

    default:
      break
  }
}, initialState.flags)
