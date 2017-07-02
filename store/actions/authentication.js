// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const login = (email, password) => async dispatch => {
  dispatch({ type: actionTypes.LOGIN })

  try {
    let token = localStorage.getItem('access_token')

    if (!token) {
      let data = JSON.stringify({
        grant_type: 'password',
        password,
        username: email,
      })

      let tokenResponse = await fetch('/token', {
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      })

      tokenResponse = await tokenResponse.json()

      token = tokenResponse.access_token
      localStorage.setItem('access_token', token)
      localStorage.setItem('email', email)
    }

    let userResponse = await fetch(`/api/profile`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'get',
    })

    userResponse = await userResponse.json()

    dispatch({
      status: 'success',
      type: actionTypes.LOGIN,
      user: userResponse.data,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.LOGIN,
    })

    console.log(error)
  }
}





export const register = () => dispatch => {
  return dispatch({
    type: actionTypes.REGISTER
  })
}
