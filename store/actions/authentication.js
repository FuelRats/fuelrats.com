// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const login = (email, password) => dispatch => {
  dispatch({ type: actionTypes.LOGIN })

  return fetch('/api/login', {
    body: JSON.stringify({
      email,
      password,
    }),
    headers: new Headers({
      'content-type': 'application/json',
    }),
    method: 'post',
  })
  .then(response => response.json())
  .then(response => {
    dispatch({
      status: 'success',
      type: actionTypes.LOGIN,
      user: response.data,
    })
  })
  .catch(error => {
    dispatch({
      status: 'error',
      type: actionTypes.LOGIN,
    })

    console.log(error)
  })
}





export const register = () => dispatch => {
  return dispatch({
    type: actionTypes.REGISTER
  })
}
