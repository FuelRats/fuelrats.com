import { produce } from 'immer'





import actionStatus from '../actionStatus'
import actionTypes from '../actionTypes'
import initialState from '../initialState'


const clearLoginState = (draftState = initialState.session) => {
  draftState.loggedIn = false
  draftState.loggingOut = false
  draftState.userId = null
}


const sessionReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.session.initialize:
      draftState.loggedIn = Boolean(action.accessToken && !action.error)
      draftState.userAgent = action.userAgent
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
        if (action.payload?.waitForDestroy) {
          draftState.loggingOut = true
        } else {
          clearLoginState(draftState)
        }
      }
      break

    case actionTypes.session.pageLoading:
      if (payload) {
        draftState.pageRequiresAuth = payload.requiresAuth
      }
      break

    case actionTypes.session.pageDestroyed:
      if (status === actionStatus.SUCCESS && draftState.loggingOut) {
        clearLoginState(draftState)
      }
      break


    default:
      break
  }
}, initialState.session)





export default sessionReducer
