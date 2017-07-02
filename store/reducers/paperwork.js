import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.paperwork, action) {
  switch (action.type) {
    case actionTypes.PAPERWORK:
      let newState = Object.assign({}, state)

      switch (action.status) {
        case 'error':
          newState.submitting = true

          break

        case 'success':
          newState.submitting = false

          break

        default:
          newState.submitting = false
      }

      return newState

    default:
      return state
  }
}
