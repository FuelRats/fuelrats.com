// Module imports
import cookies from 'next-cookies'





// Component imports
import { getActionCreators } from '../store'
import apiService from '../services/api'





const initUserSession = async (ctx) => {
  const { access_token: accessToken } = cookies(ctx)
  const { store } = ctx
  const {
    authentication: {
      loggedIn,
      verifyError,
    },
    user,
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

  let verified = loggedIn && user.attributes && !verifyError

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

      if (status === 'success') {
        verified = true
      }
    }
  } else {
    updateLoggingInState()
  }

  if (!verified) {
    return null
  }

  return accessToken
}





export default initUserSession
