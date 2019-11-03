import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function authenticationReducer (state = initialState.authentication, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_PROFILE:
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
            userId: type === actionTypes.GET_PROFILE ? payload.data.id : state.userId,
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
          loggingIn: false,
          loggedIn: false,
          userId: null,
          verifyError: payload && payload.origin && payload.origin === 'verify',
        }
      }
      break
    default:
      break
  }

  return state
}
