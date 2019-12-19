// Module imports
import JsCookie from 'js-cookie'
import nextCookies from 'next-cookies'




// Component imports
import HttpStatus from '../../helpers/httpStatus'
import frApi from '../../services/fuelrats'
import actionStatus from '../actionStatus'
import actionTypes from '../actionTypes'
import {
  selectSession,
  selectUserById,
  withCurrentUserId,
} from '../selectors'
import { getUserProfile } from './user'





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
  const user = withCurrentUserId(selectUserById)(state)
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
