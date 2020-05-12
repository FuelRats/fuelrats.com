// Component imports
import { configureRequest, deleteCookie } from '../../helpers/gIPTools'
import { HttpStatus } from '../../helpers/HttpStatus'
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




/**
 * @param {object?} ctx NextJS context. Only required when called from `getInitialProps`
 * @returns {Function} Redux action thunk
 */
export const logout = (ctx) => {
  return (dispatch, getState) => {
    deleteCookie('access_token', ctx)
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
            dispatch(logout(ctx))
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
