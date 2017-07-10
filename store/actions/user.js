// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const getUser = () => async dispatch => {
  dispatch({ type: actionTypes.GET_USER })

  try {
    let response = await fetch(`/api/profile`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'get',
    })

    response = await response.json()

    dispatch({
      status: 'success',
      type: actionTypes.GET_USER,
      user: response.data,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.GET_USER,
    })

    console.log(error)
  }
}





export const updateUser = (user) => async dispatch => {
  dispatch({ type: actionTypes.UPDATE_USER })

  try {
    let response = await fetch(`/api/users/${user.id}`, {
      body: JSON.stringify(user),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'put',
    })

    response = await response.json()

    dispatch({
      status: 'success',
      type: actionTypes.UPDATE_USER,
      user: response.data,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.UPDATE_USER,
    })

    console.log(error)
  }
}
