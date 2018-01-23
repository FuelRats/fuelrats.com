// Module imports
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'





// Component imports
import actionTypes from '../actionTypes'
import { ApiError } from '../errors'





export const retrievePaperwork = rescueId => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_PAPERWORK })

  try {
    const token = await LocalForage.getItem('access_token')

    let response = await fetch(`/api/rescues/${rescueId}`, {
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
      type: actionTypes.RETRIEVE_PAPERWORK,
    })
    return null
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.RETRIEVE_PAPERWORK,
    })
    return error
  }
}





export const submitPaperwork = (rescueId, rescue, rats) => async dispatch => {
  dispatch({ type: actionTypes.SUBMIT_PAPERWORK })

  try {
    const token = await LocalForage.getItem('access_token')

    let response = await fetch(`/api/rescues/${rescueId}`, {
      body: JSON.stringify(rescue),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      method: 'put',
    })

    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    if (rats) {
      if (rats.added.length) {
        response = await fetch(`/api/rescues/assign/${rescueId}`, {
          body: JSON.stringify(rats.added.map(rat => rat.id)),
          headers: new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
          method: 'put',
        })
      }

      response = await response.json()

      if (response.errors) {
        throw new ApiError(response)
      }

      if (rats.removed.length) {
        response = await fetch(`/api/rescues/unassign/${rescueId}`, {
          body: JSON.stringify(rats.removed.map(rat => rat.id)),
          headers: new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
          method: 'put',
        })
      }
    }

    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.SUBMIT_PAPERWORK,
    })
    return null
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.SUBMIT_PAPERWORK,
    })
    return error
  }
}
