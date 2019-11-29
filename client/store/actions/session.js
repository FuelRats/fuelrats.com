// Module imports
import nextCookies from 'next-cookies'
import JsCookie from 'js-cookie'




// Component imports
import { getUserProfile } from './user'
import {
  selectSession,
  selectUser,
  withCurrentUserId,
} from '../selectors'
import actionStatus from '../actionStatus'
import actionTypes from '../actionTypes'
import frApi from '../../services/fuelrats'
import HttpStatus from '../../helpers/httpStatus'





export const logout = (delayLogout) => (dispatch) => {
  JsCookie.remove('access_token')
  delete frApi.defaults.headers.common.Authorization

  return dispatch({
    status: 'success',
    type: actionTypes.session.logout,
    delayLogout,
  })
}





export const initUserSession = (ctx) => async (dispatch, getState) => {
  const state = getState()
  const user = withCurrentUserId(selectUser)(state)
  const session = selectSession(state)

  const { access_token: accessToken } = nextCookies(ctx)

  const result = {
    type: actionTypes.session.initialize,
    status: actionStatus.SUCCESS,
    error: null,
    accessToken,
  }

  if (!session.loggedIn) {
    if (accessToken) {
      frApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`

      if (!user && !session.error) {
        const profileReq = await getUserProfile()(dispatch)

        if (!HttpStatus.isSuccess(profileReq.response.status)) {
          result.error = profileReq.response.status
          result.status = actionStatus.ERROR

          if (profileReq.response.status === HttpStatus.UNAUTHORIZED) {
            logout()(dispatch)
            result.accessToken = null
          }
        }
      }
    }

    dispatch(result)
  }
  return result
}





export const notifyPageChange = (path) => (dispatch) => dispatch({
  type: actionTypes.session.pageChange,
  status: actionStatus.SUCCESS,
  path,
})
