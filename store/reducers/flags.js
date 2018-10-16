import actionTypes from '../actionTypes'
import initialState from '../initialState'


export default function flagsReducer (state = initialState.flags, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.SET_FLAG:
      if (status === 'success') {
        return {
          ...state,
          ...payload,
        }
      }
      break

    default:
      break
  }

  return state
}
