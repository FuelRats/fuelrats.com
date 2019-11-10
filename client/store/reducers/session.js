import actionTypes from '../actionTypes'
import initialState from '../initialState'
import actionStatus from '../actionStatus'





export default function sessionReducer (state = initialState.session, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.INIT_SESSION:
      return {
        ...state,
        loggedIn: Boolean(action.accessToken && !action.error),
        error: action.error,
      }

    case actionTypes.GET_PROFILE:
      if (status === actionStatus.SUCCESS) {
        return {
          ...state,
          userId: payload.data.id,
        }
      }
      break

    case actionTypes.LOGIN:
      if (status === actionStatus.SUCCESS) {
        return {
          ...state,
          loggedIn: true,
        }
      }
      break

    case actionTypes.LOGOUT:
      if (status === actionStatus.SUCCESS) {
        if (action.delayLogout) {
          return {
            ...state,
            loggingOut: true,
          }
        }
        return {
          ...initialState.session,
        }
      }
      break

    case actionTypes.PAGE_CHANGE:
      if (status === actionStatus.SUCCESS && state.loggingOut) {
        return {
          ...initialState.session,
        }
      }
      break


    default:
      break
  }

  return state
}
