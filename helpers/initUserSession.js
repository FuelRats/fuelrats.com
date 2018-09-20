// Module imports
import Cookies from 'next-cookies'

// Component imports
import { getActionCreators } from '../store'
import apiService from '../services/api'





export default async function initUserSession (ctx) {
  const { access_token: accessToken } = Cookies(ctx)
  const { store } = ctx
  const {
    authentication: {
      loggedIn,
      verifyError,
    },
    user: {
      attributes: userAttributes,
    },
  } = store.getState()
  const {
    getUser,
    logout,
    updateLoggingInState,
  } = getActionCreators([
    'getUser',
    'logout',
    'updateLoggingInState',
  ], store.dispatch)

  let verified = loggedIn && userAttributes && !verifyError

  if (accessToken) {
    apiService().defaults.headers.common.Authorization = `Bearer ${accessToken}`

    if (!verified) {
      const { payload, status } = await getUser()
      if (status === 'error' && payload && Array.isArray(payload.errors)) {
        const errMsg = payload.errors[0] && payload.errors[0].status
        if (errMsg === 'Unauthorized') {
          logout(true)
          verified = false
        }
      }

      verified = true
    }
  } else {
    updateLoggingInState()
  }

  if (!verified) {
    return null
  }
  return accessToken
}
