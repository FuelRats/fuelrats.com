import { isError } from 'flux-standard-action'
import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const clearLoginState = (draftState = initialState.session) => {
  draftState.loggedIn = false
  draftState.loggingOut = false
  draftState.userId = null
}


const sessionReducer = produce((draftState, action) => {
  const {
    meta,
    payload,
    error,
    type,
  } = action

  switch (type) {
    case actionTypes.session.initialize:
      draftState.loggedIn = Boolean(payload.accessToken && !error)
      draftState.userAgent = payload.userAgent
      draftState.error = meta?.error ?? error
      break

    case actionTypes.session.read:
      if (!isError(action)) {
        draftState.userId = payload.data.id
      }
      break

    case actionTypes.session.login:
      if (!isError(action)) {
        draftState.loggedIn = true
      }
      break

    case actionTypes.session.logout:
      if (!isError(action)) {
        if (payload?.waitForDestroy) {
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
      if (!isError(action) && draftState.loggingOut) {
        clearLoginState(draftState)
      }
      break


    default:
      break
  }
}, initialState.session)





export default sessionReducer
