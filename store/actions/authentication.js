// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'
import Router from 'next/router'





// Component imports
import actionTypes from '../actionTypes'





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

      let tokenResponse = await fetch('/token', {
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      })

      tokenResponse = await tokenResponse.json()

      token = tokenResponse.access_token
      localStorage.setItem('access_token', token)
      Cookies.set('access_token', token)
    }

    let userResponse = await fetch(`/api/profile`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'get',
    })

    userResponse = await userResponse.json()

    dispatch({
      status: 'success',
      type: actionTypes.LOGIN,
      user: userResponse.data,
    })

    if (location && location.search) {
      let searchParams = {}

      location.search.replace(/^\?/, '').split('&').forEach(searchParam => {
        let [ key, value ] = searchParam.split('=')

        searchParams[key] = value
      })

      Router.push(searchParams['destination'] ? searchParams['destination'] : '/profile')
    }

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.LOGIN,
    })

    console.log(error)
  }
}





export const logout = (email, password) => async dispatch => {
  dispatch({ type: actionTypes.LOGOUT })

  try {
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





export const register = () => dispatch => {
  return dispatch({
    type: actionTypes.REGISTER
  })
}
