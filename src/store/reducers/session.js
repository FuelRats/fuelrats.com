import { isError } from 'flux-standard-action'
import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const clearLoginState = (draftState = initialState.session) => {
  draftState.loggedIn = false
  draftState.loggingOut = false
  draftState.userId = null
  draftState.token = null
}


export default produce((draftState, action) => {
  const {
    meta,
    payload,
    error,
    type,
  } = action

  switch (type) {
    case actionTypes.session.initialize:
      draftState.token = payload.accessToken
      draftState.userAgent = payload.userAgent
      break

    case actionTypes.session.read:
      draftState.error = meta?.error ?? error
      if (!isError(action)) {
        draftState.loggedIn = true
        draftState.userId = payload.data.id
      }
      break

    case actionTypes.session.login:
      if (!isError(action)) {
        draftState.loggedIn = true
        draftState.token = payload.access_token
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
