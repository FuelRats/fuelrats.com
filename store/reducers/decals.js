import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.decals, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (action.type) {
    case actionTypes.CHECK_DECAL_ELIGIBILITY:
      switch (status) {
        case 'success':
          return Object.assign({}, initialState.decals, payload)

        default:
          return state
      }

    default:
      return state
  }
}
