import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.authentication, action) {
  switch (action.type) {
    case actionTypes.LOGIN:
      switch (action.status) {
        case 'error':
          return Object.assign({}, state, {
            loggedIn: false,
            loggingIn: false,
          })

        case 'success':
          return Object.assign({}, state, {
            loggedIn: true,
            loggingIn: false,
          })

        default:
          return Object.assign({}, state, {
            loggedIn: false,
            loggingIn: true,
          })
      }

    case actionTypes.LOGOUT:
      if (action.status === 'success') {
        return Object.assign({}, state, {
          loggedIn: false,
        })
      }

    default:
      return state
  }
}
