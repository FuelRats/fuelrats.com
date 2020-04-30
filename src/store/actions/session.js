// Module imports
import JsCookie from 'js-cookie'





// Component imports
import HttpStatus from '../../helpers/HttpStatus'
import { configureRequest } from '../../helpers/gIPTools'
import frApi from '../../services/fuelrats'
import actionStatus from '../actionStatus'
import actionTypes from '../actionTypes'
import {
  selectPageRequiresAuth,
  selectSession,
  selectUserById,
  withCurrentUserId,
} from '../selectors'
import { getUserProfile } from './user'





export const logout = () => {
  return (dispatch, getState) => {
    JsCookie.remove('access_token')
    delete frApi.defaults.headers.common.Authorization

    return dispatch({
      status: 'success',
      type: actionTypes.session.logout,
      payload: {
        waitForDestroy: Boolean(selectPageRequiresAuth(getState())),
      },
    })
  }
}


export const initUserSession = (ctx) => {
  return async (dispatch, getState) => {
    configureRequest(ctx)

    const { accessToken } = ctx

    const state = getState()
    const user = withCurrentUserId(selectUserById)(state)
    const session = selectSession(state)

    // Get user agent to be used by login modal and i-need-fuel page
    let userAgent = ''
    if (ctx.req && ctx.req.headers['user-agent']) {
      userAgent = ctx.req.headers['user-agent'].toLowerCase()
    } else if (typeof window !== 'undefined') {
      userAgent = window.navigator.userAgent.toLowerCase()
    }

    const result = {
      type: actionTypes.session.initialize,
      status: actionStatus.SUCCESS,
      error: null,
      accessToken,
      userAgent,
    }

    if (accessToken) {
      if (!user && !session.error) {
        const profileReq = await dispatch(getUserProfile())

        if (!HttpStatus.isSuccess(profileReq.response.status)) {
          result.error = profileReq.response.status
          result.status = actionStatus.ERROR

          if (profileReq.response.status === HttpStatus.UNAUTHORIZED) {
            dispatch(logout())
            result.accessToken = null
            ctx.accessToken = null
          }
        }

        dispatch(result)
      }
    }
    return result
  }
}


export const notifyPageLoading = ({ Component }) => {
  return (dispatch) => {
    return dispatch({
      type: actionTypes.session.pageLoading,
      status: actionStatus.SUCCESS,
      payload: {
        requiresAuth: Boolean(Component.requiresAuthentication),
      },
    })
  }
}


export const notifyPageDestroyed = () => {
  return (dispatch) => {
    return dispatch({
      type: actionTypes.session.pageDestroyed,
      status: actionStatus.SUCCESS,
    })
  }
}
