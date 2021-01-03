import { createFSA, createAxiosFSA } from '@fuelrats/web-util/actions'
import { HttpStatus } from '@fuelrats/web-util/http'
import { isError } from 'flux-standard-action'

import { configureRequest, deleteCookie } from '~/helpers/gIPTools'
import frApi from '~/services/fuelrats'

import actionTypes from '../actionTypes'
import {
  selectSessionToken,
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
  return async (dispatch, getState) => {
    deleteCookie('access_token', ctx)

    const token = selectSessionToken(getState())

    await dispatch(createAxiosFSA(
      actionTypes.oauth.authorize.delete,
      await frApi.request({
        url: '/oauth2/revoke',
        method: 'post',
        data: {
          token,
        },
      }),
    ))

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

    const { accessToken = null } = ctx

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

    if (accessToken !== session.token) {
      dispatch(action)
    }

    if (accessToken && !user && !session.error) {
      const response = await dispatch(getUserProfile())

      if (isError(response)) {
        if (response.meta.response.status === HttpStatus.UNAUTHORIZED) {
          dispatch(logout(ctx))
          ctx.accessToken = null
        }
      }
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


export const notifyPageDestroyed = () => {
  return {
    type: actionTypes.session.pageDestroyed,
  }
}
