// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const retrievePaperwork = rescueId => async dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_PAPERWORK })

  try {
    let response = await fetch(`/api/rescues/${rescueId}`, {
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }),
    })
    response = await response.json()

    dispatch({
      payload: response,
      rescue: response.data[0],
      status: 'success',
      type: actionTypes.RETRIEVE_PAPERWORK,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.RETRIEVE_PAPERWORK,
    })

    console.log(error)
  }
}





export const submitPaperwork = (rescueId, rescue, rats) => async dispatch => {
  dispatch({ type: actionTypes.SUBMIT_PAPERWORK })

  try {
    let response = await fetch(`/api/rescues/${rescueId}`, {
      body: JSON.stringify(rescue),
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }),
      method: 'put',
    })

    if (rats) {
      if (rats.added.length) {
        response = await fetch(`/api/rescues/assign/${rescueId}`, {
          body: JSON.stringify(rats.added.map(rat => rat.id)),
          headers: new Headers({
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }),
          method: 'put',
        })
      }

      if (rats.removed.length) {
        response = await fetch(`/api/rescues/unassign/${rescueId}`, {
          body: JSON.stringify(rats.removed.map(rat => rat.id)),
          headers: new Headers({
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }),
          method: 'put',
        })
      }
    }

    response = await response.json()

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.SUBMIT_PAPERWORK,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.SUBMIT_PAPERWORK,
    })

    console.log(error)
  }
}
