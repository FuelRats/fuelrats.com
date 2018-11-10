import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function authenticationReducer (state = initialState.authentication, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
    case actionTypes.LOGIN:
      switch (status) {
        case 'error':
        case 'noToken':
          return {
            ...state,
            loggedIn: false,
            loggingIn: false,
          }

        case 'success':
          return {
            ...state,
            loggedIn: true,
            loggingIn: false,
          }

        default:
          return {
            ...state,
            loggedIn: false,
            loggingIn: true,
          }
      }
    case actionTypes.LOGOUT:
      if (status === 'success') {
        return {
          ...state,
          loggedIn: false,
          verifyError: payload && payload.origin && payload.origin === 'verify',
        }
      }
      break
    default:
      break
  }
  return state
}
