import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.authentication, action) {
  switch (action.type) {
    case actionTypes.LOGIN:
      let newState = Object.assign({}, state)

      switch (action.status) {
        case 'error':
          newState.loggedIn = false
          newState.loggingIn = false

          break

        case 'success':
          newState.loggedIn = true
          newState.loggingIn = false

          break

        default:
          newState.loggedIn = false
          newState.loggingIn = true
      }

      return newState

    default:
      return state
  }
}
