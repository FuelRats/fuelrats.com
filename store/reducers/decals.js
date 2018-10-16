import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function decalsReducer (state = initialState.decals, action) {
  const {
    payload,
    status,
  } = action
  const newState = { ...state }

  switch (action.type) {
    case actionTypes.CHECK_DECAL_ELIGIBILITY:
      switch (status) {
        case 'success':
          if (payload.data) {
            newState.eligible = true
            newState.decals = newState.decals.concat(payload.data)
          } else {
            newState.eligible = payload.eligible
          }

          return newState

        default:
          return state
      }

    case actionTypes.REDEEM_DECAL:
      switch (status) {
        case 'success':
          newState.decals = newState.decals.concat(payload.data)

          return newState

        default:
          return state
      }

    default:
      return state
  }
}
