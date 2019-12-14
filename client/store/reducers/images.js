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
    case actionTypes.images.dispose:
      if (status === 'success') {
        delete draftState[id]
      }
      break


    case actionTypes.images.read:
      if (status === 'success') {
        draftState[id] = payload
      }
      break

    default:
      break
  }
}, initialState.images)




export default imageReducer
