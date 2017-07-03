// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const retrievePaperwork = (rescueId) => dispatch => {
  dispatch({ type: actionTypes.RETRIEVE_PAPERWORK })

  return fetch(`/api/rescues/${rescueId}`, {
    headers: new Headers({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    }),
  })
  .then(response => response.json())
  .then(response => {
    dispatch({
      rescue: response.data,
      status: 'success',
      type: actionTypes.RETRIEVE_PAPERWORK,
    })
  })
  .catch(error => {
    dispatch({
      status: 'error',
      type: actionTypes.RETRIEVE_PAPERWORK,
    })

    console.log(error)
  })
}





export const submitPaperwork = (paperwork) => dispatch => {
  dispatch({ type: actionTypes.SUBMIT_PAPERWORK })

  return fetch('/api/rescues', {
    body: JSON.stringify(paperwork),
    headers: new Headers({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    }),
    method: 'post',
  })
  .then(response => response.json())
  .then(response => {
    dispatch({
      status: 'success',
      type: actionTypes.SUBMIT_PAPERWORK,
    })
  })
  .catch(error => {
    dispatch({
      status: 'error',
      type: actionTypes.SUBMIT_PAPERWORK,
    })

    console.log(error)
  })
}
