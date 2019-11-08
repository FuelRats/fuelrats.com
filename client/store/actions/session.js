// Module imports
import nextCookies from 'next-cookies'
import JsCookie from 'js-cookie'




// Component imports
import { frApiRequest } from './services'
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
    type: actionTypes.LOGOUT,
    delayLogout,
  })
}

export const getUserProfile = () => frApiRequest(
  actionTypes.GET_PROFILE,
  { url: '/profile' },
)


export const initUserSession = (ctx) => async (dispatch, getState) => {
  const state = getState()
  const user = withCurrentUserId(selectUser)(state)
  const session = selectSession(state)

  let { access_token: accessToken } = nextCookies(ctx)
  let error = null

  if (accessToken) {
    frApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`

    if (!user && !session.error) {
      const profileReq = await getUserProfile()(dispatch)

      error = HttpStatus.isSuccess(profileReq.response.status) ? null : profileReq.response.status

      if (error === HttpStatus.UNAUTHORIZED) {
        logout()(dispatch)
        accessToken = null
      }
    }
  }

  return dispatch({
    type: actionTypes.INIT_SESSION,
    status: error ? actionStatus.ERROR : actionStatus.SUCCESS,
    error,
    accessToken,
  })
}
