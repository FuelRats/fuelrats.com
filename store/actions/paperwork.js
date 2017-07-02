// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const retrievePaperwork = (rescueId) => dispatch => {
  dispatch({ type: actionTypes.PAPERWORK })

  return fetch(`/api/rescues/${rescueId}`)
  .then(response => response.json())
  .then(response => {
    dispatch({
      status: 'success',
      type: actionTypes.PAPERWORK,
    })
  })
  .catch(error => {
    dispatch({
      status: 'error',
      type: actionTypes.PAPERWORK,
    })

    console.log(error)
  })
}





export const submitPaperwork = (paperwork) => dispatch => {
  dispatch({ type: actionTypes.PAPERWORK })

  return fetch('/api/rescues', {
    body: JSON.stringify(paperwork),
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    method: 'post',
  })
  .then(response => response.json())
  .then(response => {
    dispatch({
      status: 'success',
      type: actionTypes.PAPERWORK,
    })
  })
  .catch(error => {
    dispatch({
      status: 'error',
      type: actionTypes.PAPERWORK,
    })

    console.log(error)
  })
}
