// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const login = (email, password) => dispatch => {
  dispatch({ type: actionTypes.LOGIN })

  return fetch('https://dev.api.fuelrats.com/login', {
    body: JSON.stringify({
      email,
      password,
    }),
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
