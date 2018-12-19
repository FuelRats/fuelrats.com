// Module imports
import Cookies from 'js-cookie'





// Component imports
import { createApiAction } from '../actionCreators'
import { Router } from '../../routes'
import actionTypes from '../actionTypes'
import apiService from '../../services/api'





// Component constants
const SESSION_TOKEN_LENGTH = 365 // days





export const changePassword = (currentPassword, newPassword) => createApiAction({
  actionType: actionTypes.CHANGE_PASSWORD,
  url: '/users/setpassword',
  method: 'put',
  data: {
    password: currentPassword,
    new: newPassword,
  },
})





export const login = ({
  email,
  password,
  route,
  routeParams,
  remember,
}) => createApiAction({
  actionType: actionTypes.LOGIN,
  url: '/oauth2/token',
  method: 'post',
  data: {
    grant_type: 'password', /* eslint-disable-line camelcase */ // name required by api
    password,
    username: email,
  },
  onSuccess: (response) => {
    const token = response.data.access_token

    Cookies.set('access_token', token, { expires: remember ? SESSION_TOKEN_LENGTH : null })
    apiService().defaults.headers.common.Authorization = `Bearer ${token}`
  },
  onComplete: ({ status }) => {
    if (status === 'error') {
      return
    }

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
  },
})


export const getClientOAuthPage = (params) => createApiAction({
  actionType: actionTypes.GET_CLIENT_AUTHORIZATION_PAGE,
  url: '/oauth2/authorize',
  onSuccess: (res) => res,
  params,
})


export const logout = (fromVerification) => (dispatch) => {
  Cookies.remove('access_token')
  delete apiService().defaults.headers.common.Authorization

  const result = dispatch({
    payload: {
      origin: fromVerification ? 'verify' : 'user',
    },
    status: 'success',
    type: actionTypes.LOGOUT,
  })

  return result
}





export const register = ({ recaptcha, ...data }) => createApiAction({
  actionType: actionTypes.REGISTER,
  url: '/register',
  method: 'post',
  data: {
    ...data,
    'g-recaptcha-response': recaptcha,
  },
})





export const resetPassword = ({ password, token }) => createApiAction({
  actionType: actionTypes.RESET_PASSWORD,
  method: 'post',
  url: `/reset/${token}`,
  data: {
    password,
  },
})





export const sendPasswordResetEmail = (email) => createApiAction({
  actionType: actionTypes.SEND_PASSWORD_RESET_EMAIL,
  url: '/reset',
  method: 'post',
  data: {
    email,
  },
})


export const updateLoggingInState = (success) => (dispatch) => dispatch({
  payload: null,
  status: success ? 'success' : 'noToken',
  type: actionTypes.LOGIN,
})





export const validatePasswordResetToken = (token) => createApiAction({
  actionType: actionTypes.VALIDATE_PASSWORD_RESET_TOKEN,
  url: `/reset/${token}`,
})
