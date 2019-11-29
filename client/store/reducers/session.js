import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'
import actionStatus from '../actionStatus'





const sessionReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.session.initialize:
      draftState.loggedIn = Boolean(action.accessToken && !action.error)
      draftState.error = action.error
      break

    case actionTypes.session.read:
      if (status === actionStatus.SUCCESS) {
        draftState.userId = payload.data.id
      }
      break

    case actionTypes.session.login:
      if (status === actionStatus.SUCCESS) {
        draftState.loggedIn = true
      }
      break

    case actionTypes.session.logout:
      if (status === actionStatus.SUCCESS) {
        if (action.delayLogout) {
          draftState.loggingOut = true
        }
        return initialState.session
      }
      break

    case actionTypes.session.pageChange:
      if (status === actionStatus.SUCCESS && draftState.loggingOut) {
        return initialState.session
      }
      break


    default:
      break
  }

  return draftState
}, initialState.session)





export default sessionReducer
