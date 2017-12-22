// Module imp
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'
import Router from 'next/router'





// Component imports
import actionTypes from '../actionTypes'





const dev = preval`module.exports = process.env.NODE_ENV !== 'production'`





export const addNickname = (nickname, password) => async dispatch => {
  dispatch({ type: actionTypes.ADD_NICKNAME })

  try {
    const token = await LocalForage.getItem('access_token')

    await fetch('/api/nicknames', {
      body: JSON.stringify({
        nickname,
        password,
      }),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      method: 'post',
    })

    dispatch({
      status: 'success',
      type: actionTypes.ADD_NICKNAME,
      payload: nickname,
    })
  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.ADD_NICKNAME,
    })
  }
}





export const getUser = () => async dispatch => {
  dispatch({ type: actionTypes.GET_USER })

  try {
    const token = await LocalForage.getItem('access_token')

    if (!token) {
      throw new Error('Bad access token')
    }

    let response = await fetch('/api/profile', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'get',
    })

    response = await response.json()

    Cookies.set('access_token', token, { expires: 365 })

    const user = { ...response.data }

    await Promise.all([
      LocalForage.setItem('userId', user.id),
      LocalForage.setItem('preferences', user.data.website.preferences),
    ])

    if (user.data.website.preferences) {
      Cookies.set('trackableUserId', user.id, dev ? { domain: '.fuelrats.com' } : {})
    }


    dispatch({
      status: 'success',
      type: actionTypes.GET_USER,
      payload: response,
    })
  } catch (error) {
    Cookies.remove('access_token')

    await Promise.all([
      LocalForage.removeItem('access_token'),
      LocalForage.removeItem('userId'),
      LocalForage.removeItem('preferences'),
    ])

    dispatch({
      status: 'error',
      type: actionTypes.GET_USER,
    })

    /* eslint-disable no-restricted-globals */
    Router.push(location.pathname === '/' ? '/' : `/?authenticate=true&destination=${encodeURIComponent(location.pathname.concat(location.search))}`)
    /* eslint-enable */
  }
}





export const updateUser = (user) => async dispatch => {
  dispatch({ type: actionTypes.UPDATE_USER })

  try {
    const token = await LocalForage.getItem('access_token')

    let response = await fetch(`/api/users/${user.id}`, {
      body: JSON.stringify(user),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      method: 'put',
    })

    response = await response.json()

    dispatch({
      status: 'success',
      type: actionTypes.UPDATE_USER,
      user: response.data,
    })
  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.UPDATE_USER,
    })
  }
}
