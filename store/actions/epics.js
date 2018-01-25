// Module imports
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'





// Component imports
import actionTypes from '../actionTypes'
import { ApiError } from '../errors'





export const retrieveEpic = epicId => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_EPIC })

  try {
    const token = await LocalForage.getItem('access_token')

    let response = await fetch(`/api/epics/${epicId}`, {
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

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.RETRIEVE_EPIC,
    })
    return null
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.RETRIEVE_EPIC,
    })
    return error
  }
}





export const createEpic = payload => async dispatch => {
  dispatch({ type: actionTypes.CREATE_EPIC })

  try {
    const token = await LocalForage.getItem('access_token')

    let response = await fetch('/api/epics', {
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

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.CREATE_EPIC,
    })
    return null
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.CREATE_EPIC,
    })
    return error
  }
}
