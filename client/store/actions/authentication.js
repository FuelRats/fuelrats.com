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
  actionTypes.CHANGE_PASSWORD,
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

  return dispatch(createAxiosAction(actionTypes.LOGIN, response))
}





export const getClientOAuthPage = (params) => frApiRequest(
  actionTypes.GET_CLIENT_AUTHORIZATION_PAGE,
  {
    url: '/oauth2/authorize',
    params,
  },
)





export const register = ({ recaptcha, ...data }) => frApiRequest(
  actionTypes.REGISTER,
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
  actionTypes.RESET_PASSWORD,
  {
    url: `/reset/${token}`,
    method: 'post',
    data: {
      password,
    },
  },
)





export const sendPasswordResetEmail = (email) => frApiRequest(
  actionTypes.SEND_PASSWORD_RESET_EMAIL,
  {
    url: '/reset',
    method: 'post',
    data: {
      email,
    },
  },
)





export const updateLoggingInState = (success) => (dispatch) => dispatch({
  type: actionTypes.LOGIN,
  payload: null,
  status: success ? 'success' : 'noToken',
})





export const validatePasswordResetToken = (token) => frApiRequest(
  actionTypes.VALIDATE_PASSWORD_RESET_TOKEN,
  { url: `/reset/${token}` },
)
