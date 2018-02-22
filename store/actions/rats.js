/* eslint no-await-in-loop:off */
// Module imports
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'





// Component imports
import actionTypes from '../actionTypes'
import { ApiError } from '../errors'





export const createRat = (name, platform, userId) => async dispatch => {
  try {
    dispatch({
      type: actionTypes.CREATE_RAT,
    })

    const token = await LocalForage.getItem('access_token')

    let response = await fetch('/api/rats', {
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

    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    dispatch({
      rat: response.data,
      status: 'success',
      type: actionTypes.CREATE_RAT,
    })
    return null
  } catch (error) {
    dispatch({
      payload: error,
      rat: userId,
      status: 'error',
      type: actionTypes.CREATE_RAT,
    })
    return error
  }
}





export const getRats = ratIds => async dispatch => {
  for (const ratId of ratIds) {
    try {
      dispatch({
        rat: ratId,
        type: actionTypes.GET_RAT,
      })

      let response = await fetch(`/api/rats/${ratId}`)
      response = await response.json()

      dispatch({
        rat: response.data,
        status: 'success',
        type: actionTypes.GET_RAT,
      })
    } catch (error) {
      dispatch({
        payload: error,
        rat: ratId,
        status: 'error',
        type: actionTypes.GET_RAT,
      })
    }
  }
}
