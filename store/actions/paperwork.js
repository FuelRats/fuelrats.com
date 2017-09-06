// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const retrievePaperwork = (rescueId) => async dispatch => {
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





export const submitPaperwork = (rescueId, rescue) => async dispatch => {
  dispatch({ type: actionTypes.SUBMIT_PAPERWORK })

  try {
    let response = await fetch(`/api/rescues/${rescueId ? rescueId : null}`, {
      body: JSON.stringify(rescue),
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }),
      method: rescueId ? 'put' : 'post',
    })
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
