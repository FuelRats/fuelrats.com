/* globals $IS_DEVELOPMENT:false */





// Module imports
import Cookies from 'js-cookie'





// Component imports
import { HttpStatus } from '../../helpers/HttpStatus'
import { presentApiRequestBody } from '../../helpers/presenters'
import { Router } from '../../routes'
import frApi from '../../services/fuelrats'
import actionTypes from '../actionTypes'
import { frApiRequest, createAxiosAction } from './services'





// Component constants
const SESSION_TOKEN_LENGTH = 365 // days





export const changePassword = ({ id, ...data }) => {
  return frApiRequest(
    actionTypes.passwords.update,
    {
      url: `/users/${id}/password`,
      method: 'patch',
      data: presentApiRequestBody('password-changes', data),
    },
  )
}


export const login = (options) => {
  return async (dispatch) => {
    const {
      password,
      email,
      fingerprint,
      route,
      routeParams,
      remember,
    } = options

    const response = await frApi.request({
      url: '/oauth2/token',
      method: 'post',
      headers: {
        'X-Fingerprint': fingerprint,
      },
      data: {
        grant_type: 'password', /* eslint-disable-line camelcase */ // name required by api
        password,
        username: email,
      },
    })

    if (HttpStatus.isSuccess(response.status)) {
      const token = response.data.access_token

      Cookies.set('access_token', token, { expires: remember ? SESSION_TOKEN_LENGTH : null })
      frApi.defaults.headers.common.Authorization = `Bearer ${token}`

      /* eslint-disable no-restricted-globals */
      if (location && location.search) {
        const searchParams = {}

        location.search.replace(/^\?/u, '').split('&').forEach((searchParam) => {
          const [key, value] = searchParam.split('=')

          searchParams[key] = value
        })

        const destination = searchParams.destination ? decodeURIComponent(searchParams.destination) : '/profile'

        Router.push(destination)
      } else if (route) {
        Router.pushRoute(route, routeParams)
      }
    /* eslint-enable no-restricted-globals */
    }

    return dispatch(createAxiosAction(actionTypes.session.login, response))
  }
}


export const getClientOAuthPage = (params) => {
  const action = frApiRequest(
    actionTypes.session.readClientOAuthPage,
    {
      url: '/oauth2/authorize',
      params,
    },
  )

  if ($IS_DEVELOPMENT) {
    // The API sends these cookies as secure & httponly, this breaks them in a development environment
    action.response.headers['set-cookie'] = action.response.headers['set-cookie'].map((cookieString) => {
      return cookieString.replace('; secure; httponly', '')
    })
  }

  return action
}


export const register = (data) => {
  return frApiRequest(
    actionTypes.session.register,
    {
      url: '/register',
      method: 'post',
      data: presentApiRequestBody('users', data),
    },
  )
}


export const resetPassword = ({ token, ...data }) => {
  return frApiRequest(
    actionTypes.passwords.reset,
    {
      url: `/reset/${token}`,
      method: 'post',
      data: presentApiRequestBody('resets', data),
    },
  )
}


export const sendPasswordResetEmail = (email) => {
  return frApiRequest(
    actionTypes.passwords.requestReset,
    {
      url: '/reset',
      method: 'post',
      data: presentApiRequestBody('resets', { email }),
    },
  )
}


export const validatePasswordResetToken = (token) => {
  return frApiRequest(
    actionTypes.passwords.validateReset,
    {
      url: `/reset/${token}`,
    },
  )
}
