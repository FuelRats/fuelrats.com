import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const imageReducer = produce((draftState, action) => {
  const {
    id,
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_IMAGE:
      if (status === 'success') {
        draftState[id] = payload
      }
      break

    case actionTypes.DISPOSE_IMAGE:
      if (status === 'success') {
        delete draftState[id]
      }
      break

    default:
      break
  }
}, initialState.images)




export default imageReducer
