// Module imports
import cookies from 'next-cookies'





// Component imports
import { getActionCreators } from '../store'
import frApi from '../services/fuelrats'
import { selectAuthentication, selectUser, withCurrentUser } from '../store/selectors'





const initUserSession = async (ctx) => {
  const { access_token: accessToken } = cookies(ctx)
  const { store } = ctx
  const state = store.getState()
  const {
    getCurrentUserProfile,
    logout,
    updateLoggingInState,
  } = getActionCreators([
    'getCurrentUserProfile',
    'logout',
    'updateLoggingInState',
  ], store.dispatch)

  const user = withCurrentUser(selectUser)(state)
  const authentication = selectAuthentication(state)

  let verified = authentication.loggedIn && user && !authentication.verifyError

  if (accessToken) {
    frApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`

    if (!verified) {
      const { payload, status } = await getCurrentUserProfile()

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
