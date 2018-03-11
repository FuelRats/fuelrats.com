/* eslint no-await-in-loop:off */
// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const createRat = (name, platform, userId) => async dispatch => {
  dispatch({ type: actionTypes.CREATE_RAT })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch('/api/rats', {
      body: JSON.stringify({
        name,
        platform,
        userId,
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
    type: actionTypes.CREATE_RAT,
  })
}





export const getRats = ratIds => async dispatch => {
  for (const ratId of ratIds) {
    dispatch({ rat: ratId, type: actionTypes.GET_RAT })

    let response = null
    let success = false

    try {
      response = await fetch(`/api/rats/${ratId}`)

      success = response.ok
      response = await response.json()
    } catch (error) {
      success = false
      response = error
    }

    dispatch({
      payload: response,
      status: success ? 'success' : 'error',
      type: actionTypes.GET_RAT,
    })
  }
}
