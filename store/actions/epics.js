// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'
import { ApiError } from '../errors'





export const retrieveEpic = epicId => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_EPIC })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch(`/api/epics/${epicId}`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    if (!response.data.length) {
      throw new Error('Rescue not found')
    }

    success = true
  } catch (error) {
    response = error
    success = false
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.RETRIEVE_EPIC,
  })
}





export const createEpic = payload => async dispatch => {
  dispatch({ type: actionTypes.CREATE_EPIC })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch('/api/epics', {
      body: JSON.stringify(payload),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      method: 'post',
    })

    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    success = true
  } catch (error) {
    response = error
    success = false
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.CREATE_EPIC,
  })
}
