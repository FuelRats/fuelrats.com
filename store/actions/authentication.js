// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'





// Component imports
import { Router } from '../../routes'
import actionTypes from '../actionTypes'





export const changePassword = (currentPassword, newPassword) => async dispatch => {
  dispatch({ type: actionTypes.CHANGE_PASSWORD })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch('/api/users/setpassword', {
      body: JSON.stringify({
        password: currentPassword,
        new: newPassword,
      }),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'put',
    })

    success = response.ok
    response = await response.json()
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.CHANGE_PASSWORD,
  })
}





export const login = (email, password) => async dispatch => {
  dispatch({ type: actionTypes.LOGIN })

  let response = null
  let success = false

  try {
    let token = Cookies.get('access_token')

    if (!token) {
      response = await fetch('/token', {
        body: JSON.stringify({
          grant_type: 'password',
          password,
          username: email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      })

      success = response.ok
      response = await response.json()

      token = response.access_token

      Cookies.set('access_token', token, { expires: 365 })
    } else {
      response = null
      success = true
    }
  } catch (error) {
    response = error
    success = false
  }

  const result = dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.LOGIN,
  })

  /* eslint-disable no-restricted-globals*/
  if (location && location.search) {
    const searchParams = {}

    location.search.replace(/^\?/, '').split('&').forEach(searchParam => {
      const [key, value] = searchParam.split('=')

      searchParams[key] = value
    })
    const destination = searchParams.destination ? decodeURIComponent(searchParams.destination) : '/profile'

    Router.pushRoute(destination)
  }
  /* eslint-enable */

  return result
}





export const logout = () => async dispatch => {
  dispatch({ type: actionTypes.LOGOUT })

  let response = null
  let success = false

  try {
    Cookies.remove('access_token')
    Cookies.remove('user_id')
    await LocalForage.removeItem('preferences')

    success = true
  } catch (error) {
    response = error
    success = false
  }

  const result = dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.LOGOUT,
  })

  Router.push('/')

  return result
}





export const register = (email, password, name, platform, nickname, recaptcha) => async dispatch => {
  dispatch({ type: actionTypes.REGISTER })

  let response = null
  let success = false

  try {
    response = await fetch('/api/register', {
      body: JSON.stringify({
        email,
        password,
        name,
        platform,
        nickname,
        'g-recaptcha-response': recaptcha,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    })

    if (!response.ok) {
      throw new Error('Error Registering!')
    }

    response = await fetch('/token', {
      body: JSON.stringify({
        grant_type: 'password',
        password,
        username: email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    })

    response = await response.json()

    if (response.access_token) {
      Cookies.set('access_token', response.access_token, { expires: 365 })
    }

    response = null
    success = response.ok
  } catch (error) {
    response = error
    success = false
  }

  const result = dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.REGISTER,
  })

  if (success) {
    Router.push('/profile')
  }

  return result
}





export const resetPassword = (password, token) => async dispatch => {
  dispatch({ type: actionTypes.RESET_PASSWORD })

  let response = null
  let success = false

  try {
    response = await fetch(`/api/reset/${token}`, {
      body: JSON.stringify({
        password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'post',
    })

    success = response.ok
    response = await response.json()
  } catch (error) {
    response = error
    success = false
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.RESET_PASSWORD,
  })
}





export const sendPasswordResetEmail = email => async dispatch => {
  dispatch({ type: actionTypes.SEND_PASSWORD_RESET_EMAIL })

  let response = null
  let success = false

  try {
    response = await fetch('/api/reset', {
      body: JSON.stringify({
        email,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'post',
    })

    success = response.ok
    response = await response.json()
  } catch (error) {
    response = error
    success = false
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.SEND_PASSWORD_RESET_EMAIL,
  })
}





export const validatePasswordResetToken = (token) => async dispatch => {
  dispatch({ type: actionTypes.VALIDATE_PASSWORD_RESET_TOKEN })


  let response = null
  let success = false

  try {
    response = await fetch(`/api/reset/${token}`)
    success = response.ok
  } catch (error) {
    response = error
    success = false
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.VALIDATE_PASSWORD_RESET_TOKEN,
  })
}
