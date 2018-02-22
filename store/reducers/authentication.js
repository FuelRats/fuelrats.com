import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.authentication, action) {
  const {
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
    case actionTypes.LOGIN:
      switch (status) {
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
      if (status === 'success') {
        return Object.assign({}, state, {
          loggedIn: false,
        })
      }
      break
    default:
      break
  }
  return state
}
