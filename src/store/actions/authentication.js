import { createAxiosFSA } from '@fuelrats/web-util/actions'
import { isError } from 'flux-standard-action'
import Cookies from 'js-cookie'
import Router from 'next/router'

import frApi from '~/services/frApi'
import getFingerprint from '~/util/getFingerprint'
import createRequestBody from '~/util/jsonapi/createRequestBody'

import actionTypes from '../actionTypes'
import { frApiPlainRequest } from './services'





// Component constants
const SESSION_TOKEN_LENGTH = 365 // days



export const changePassword = ({ id, ...data }) => {
  return frApiPlainRequest(
    actionTypes.passwords.update,
    {
      url: `/users/${id}/password`,
      method: 'patch',
      data: createRequestBody('password-changes', data),
    },
  )
}





export const login = (options) => {
  return async (dispatch) => {
    const {
      remember,
      data,
    } = options

    const fingerprint = await getFingerprint()

    const action = createAxiosFSA(
      actionTypes.session.login,
      await frApi.request({
        url: '/oauth2/token',
        method: 'post',
        headers: {
          'X-Fingerprint': fingerprint,
        },
        data: {
          grant_type: 'password',
          ...data,
        },
      }),
    )

    if (!isError(action)) {
      const token = action.payload.access_token

      Cookies.set('access_token', token, { expires: remember ? SESSION_TOKEN_LENGTH : null })

      if (location && location.search) {
        const searchParams = new URLSearchParams(location.search)

        const destination = searchParams.has('destination')
          ? decodeURIComponent(searchParams.get('destination'))
          : '/profile'

        Router.push(destination)
      }
    }

    return dispatch(action)
  }
}


export const getClientOAuthPage = (params) => {
  return frApiPlainRequest(
    actionTypes.oauth.authorize.read,
    {
      url: '/oauth2/authorize',
      timeout: 45000, // Temporary until xlex fixes his crap
      params,
    },
  )
}


export const submitOAuthDecision = (data) => {
  return frApiPlainRequest(
    actionTypes.oauth.authorize.create,
    {
      url: '/oauth2/authorize',
      method: 'post',
      data,
    },
  )
}


export const register = (data) => {
  return async (dispatch) => {
    const fingerprint = await getFingerprint()

    return dispatch(
      frApiPlainRequest(
        actionTypes.session.register,
        {
          url: '/register',
          method: 'post',
          headers: {
            'X-Fingerprint': fingerprint,
          },
          data: createRequestBody('registrations', data),
        },
      ),
    )
  }
}


export const resetPassword = (token, data) => {
  return frApiPlainRequest(
    actionTypes.passwords.reset,
    {
      url: `/resets/${token}`,
      method: 'post',
      data: createRequestBody('resets', data),
    },
  )
}


export const sendPasswordResetEmail = (data) => {
  return frApiPlainRequest(
    actionTypes.passwords.requestReset,
    {
      url: '/resets',
      method: 'post',
      data: createRequestBody('resets', data),
    },
  )
}


export const validatePasswordResetToken = (token) => {
  return frApiPlainRequest(
    actionTypes.passwords.validateReset,
    {
      url: `/resets/${token}`,
    },
  )
}
