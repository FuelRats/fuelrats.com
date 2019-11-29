// Module imports
import Cookies from 'js-cookie'





// Component imports
import { frApiRequest, createAxiosAction } from './services'
import { Router } from '../../routes'
import actionTypes from '../actionTypes'
import frApi from '../../services/fuelrats'
import httpStatus from '../../helpers/httpStatus'





// Component constants
const SESSION_TOKEN_LENGTH = 365 // days





export const changePassword = (currentPassword, newPassword) => frApiRequest(
  actionTypes.session.password.update,
  {
    url: '/users/setpassword',
    method: 'put',
    data: {
      password: currentPassword,
      new: newPassword,
    },
  },
)





export const login = (options) => async (dispatch) => {
  const {
    password,
    email,
    route,
    routeParams,
    remember,
  } = options

  const response = await frApi.request({
    url: '/oauth2/token',
    method: 'post',
    data: {
      grant_type: 'password', /* eslint-disable-line camelcase */ // name required by api
      password,
      username: email,
    },
  })

  if (httpStatus.isSuccess(response.status)) {
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

      Router.pushRoute(destination)
    } else if (route) {
      Router.pushRoute(route, routeParams)
    }
    /* eslint-enable no-restricted-globals */
  }

  return dispatch(createAxiosAction(actionTypes.session.login, response))
}





export const getClientOAuthPage = (params) => frApiRequest(
  actionTypes.session.getClientOAuthPage,
  {
    url: '/oauth2/authorize',
    params,
  },
)





export const register = ({ recaptcha, ...data }) => frApiRequest(
  actionTypes.session.register,
  {
    url: '/register',
    method: 'post',
    data: {
      ...data,
      'g-recaptcha-response': recaptcha,
    },
  },
)





export const resetPassword = ({ password, token }) => frApiRequest(
  actionTypes.session.password.reset,
  {
    url: `/reset/${token}`,
    method: 'post',
    data: {
      password,
    },
  },
)





export const sendPasswordResetEmail = (email) => frApiRequest(
  actionTypes.session.password.requestReset,
  {
    url: '/reset',
    method: 'post',
    data: {
      email,
    },
  },
)





export const validatePasswordResetToken = (token) => frApiRequest(
  actionTypes.session.password.validateReset,
  { url: `/reset/${token}` },
)
