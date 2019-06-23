import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function imageReducer (state = initialState.images, action) {
  const {
    id,
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_IMAGE:
      if (status === 'success') {
        return {
          ...state,
          [id]: payload,
        }
      }
      break

    case actionTypes.DISPOSE_IMAGE:
      if (status === 'success') {
        const newState = { ...state }

        delete newState[id]

        return newState
      }
      break

    default:
      break
  }

  return state
}
