// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const retrievePaperwork = rescueId => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_PAPERWORK })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch(`/api/rescues/${rescueId}`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })

    success = response.ok
    response = await response.json()

    if (!response.data.length) {
      throw new Error('Rescue not found')
    }
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.RETRIEVE_PAPERWORK,
  })
}




export const submitPaperwork = (rescueId, rescue, rats) => async dispatch => {
  dispatch({ type: actionTypes.SUBMIT_PAPERWORK })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch(`/api/rescues/${rescueId}`, {
      body: JSON.stringify(rescue),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      method: 'put',
    })

    success = response.ok
    if (!success) {
      throw new Error('Error Submitting Paperwork')
    }

    response = await response.json()

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

        success = response.ok
        if (!success) {
          throw new Error('Error Submitting Paperwork')
        }

        response = await response.json()
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
        success = response.ok
        if (!success) {
          throw new Error('Error Submitting Paperwork')
        }

        response = await response.json()
      }
    }

    success = true
  } catch (error) {
    response = error
    success = false
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.SUBMIT_PAPERWORK,
  })
}
