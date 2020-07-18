// Component imports
import { createFSA } from '@fuelrats/web-util/actions'
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'

import { configureRequest, deleteCookie } from '~/helpers/gIPTools'
import frApi from '~/services/fuelrats'

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

    return dispatch(
      createFSA(
        actionTypes.session.logout,
        {
          waitForDestroy: Boolean(selectPageRequiresAuth(getState())),
        },
      ),
    )
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

    const action = createFSA(
      actionTypes.session.initialize,
      {
        accessToken,
        userAgent,
      },
    )

    if (accessToken && !user && !session.error) {
      const response = await dispatch(getUserProfile())

      if (isError(response)) {
        action.error = true
        action.meta.error = response?.meta?.response?.status

        if (response?.meta?.response?.status === HttpStatus.UNAUTHORIZED) {
          dispatch(logout(ctx))
          action.payload.accessToken = null
          ctx.accessToken = null
        }
      }

      dispatch(action)
    }
    return action
  }
}


export const notifyPageLoading = ({ Component }) => {
  return (dispatch) => {
    return dispatch({
      type: actionTypes.session.pageLoading,
      payload: {
        requiresAuth: Boolean(Component.requiresAuthentication),
      },
    })
  }
}


export const notifyPageDestroyed = (result) => {
  return (dispatch) => {
    // Prevents double event fire from both pages coming to a rest. we only detect the old page.
    if (result.finished && result?.value?.opacity === 0) {
      return dispatch({
        type: actionTypes.session.pageDestroyed,
      })
    }
    return {}
  }
}
