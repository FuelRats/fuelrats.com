// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'





// Component imports
import { Router } from '../../routes'
import actionTypes from '../actionTypes'
import initialState from '../initialState'




const dev = preval`module.exports = process.env.NODE_ENV !== 'production'`





export const addNickname = (nickname, password) => async dispatch => {
  dispatch({ type: actionTypes.ADD_NICKNAME })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch('/api/nicknames', {
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

    success = response.ok
    response = await response.json()
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.ADD_NICKNAME,
  })
}





export const getUser = () => async dispatch => {
  dispatch({ type: actionTypes.GET_USER })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    if (!token) {
      throw new Error('Bad access token')
    }

    response = await fetch('/api/profile', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'get',
    })

    success = response.ok
    response = await response.json()

    const user = { ...response.data }

    let userPreferences = null

    if (user.attributes.data && user.attributes.data.website && user.attributes.data.website.preferences) {
      userPreferences = user.attributes.data.website.preferences
    } else {
      userPreferences = { ...initialState.user.preferences }
    }

    Cookies.set('access_token', token, { expires: 365 })
    Cookies.set('user_id', user.id, { expires: 365 })

    if (userPreferences.allowUniversalTracking) {
      Cookies.set('trackableUserId', user.id, dev ? { domain: '.fuelrats.com' } : {})
    }
    await LocalForage.setItem('preferences', userPreferences)
  } catch (error) {
    success = false
    response = error

    Cookies.remove('access_token')
    Cookies.remove('user_id')
    await LocalForage.removeItem('preferences')

    /* eslint-disable no-restricted-globals */
    Router.push(location.pathname === '/' ? '/' : `/?authenticate=true&destination=${encodeURIComponent(location.pathname.concat(location.search))}`)
    /* eslint-enable */
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.GET_USER,
  })
}





export const updateUser = (user) => async dispatch => {
  dispatch({ type: actionTypes.UPDATE_USER })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch(`/api/users/${user.id}`, {
      body: JSON.stringify(user),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
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
    type: actionTypes.UPDATE_USER,
  })
}
