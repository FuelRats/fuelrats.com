// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'
import Router from 'next/router'





// Component imports
import actionTypes from '../actionTypes'





export const changePassword = (currentPassword, newPassword) => async dispatch => {
  dispatch({ type: actionTypes.CHANGE_PASSWORD })

  try {
    let token = localStorage.getItem('access_token')

    let response = await fetch(`/api/users/setpassword`, {
      body: JSON.stringify({
        password: currentPassword,
        new: newPassword,
      }),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'put',
    })

    response = await response.json()

    dispatch({
      status: 'success',
      type: actionTypes.CHANGE_PASSWORD,
      payload: response,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.CHANGE_PASSWORD,
    })

    console.log(error)
  }
}





export const login = (email, password) => async dispatch => {
  dispatch({ type: actionTypes.LOGIN })

  try {
    let token = localStorage.getItem('access_token')

    if (!token) {
      let data = JSON.stringify({
        grant_type: 'password',
        password,
        username: email,
      })

      let response = await fetch('/token', {
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      })

      response = await response.json()

      token = response.access_token
      localStorage.setItem('access_token', token)
      Cookies.set('access_token', token)
    }

    dispatch({
      status: 'success',
      type: actionTypes.LOGIN,
    })

    if (location && location.search) {
      let searchParams = {}

      location.search.replace(/^\?/, '').split('&').forEach(searchParam => {
        let [ key, value ] = searchParam.split('=')

        searchParams[key] = value
      })

      location = searchParams['destination'] ? decodeURIComponent(searchParams['destination']) : '/profile'
    }

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.LOGIN,
    })

    console.log(error)
  }
}





export const logout = () => async dispatch => {
  dispatch({ type: actionTypes.LOGOUT })

  try {
    localStorage.removeItem('userId')
    localStorage.removeItem('preferences')
    localStorage.removeItem('access_token')
    Cookies.remove('access_token')
    Router.push('/')

    dispatch({
      status: 'success',
      type: actionTypes.LOGOUT,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.LOGOUT,
    })

    console.log(error)
  }
}





export const register = (email, password, name, platform, nickname, recaptcha) => async dispatch => {
  dispatch({ type: actionTypes.REGISTER })

  try {
    let token

    let response = await fetch('/api/register', {
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

    token = response.access_token
    localStorage.setItem('access_token', token)
    Cookies.set('access_token', token)

    dispatch({
      status: 'success',
      type: actionTypes.REGISTER,
    })

    Router.push('/profile')

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.REGISTER,
    })

    console.log(error)
  }
}





export const resetPassword = (password, token) => async dispatch => {
  dispatch({ type: actionTypes.RESET_PASSWORD })

  try {
    let response = await fetch(`/api/reset/${token}`, {
      body: JSON.stringify({
        password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'post',
    })

    response = await response.json()

    dispatch({
      status: 'success',
      type: actionTypes.RESET_PASSWORD,
      payload: response,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.RESET_PASSWORD,
    })

    console.log(error)
  }
}





export const sendPasswordResetEmail = email => async dispatch => {
  dispatch({ type: actionTypes.SEND_PASSWORD_RESET_EMAIL })

  try {
    let token = localStorage.getItem('access_token')

    let response = await fetch(`/api/reset`, {
      body: JSON.stringify({
        email,
      }),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      method: 'post',
    })

    response = await response.json()

    dispatch({
      status: 'success',
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL,
      payload: response,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL,
    })

    console.log(error)
  }
}
