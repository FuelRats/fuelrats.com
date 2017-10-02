// Module imports
import fetch from 'isomorphic-fetch'


// Component imports
import actionTypes from '../actionTypes'




export const authorize = (transaction_id, scope, allow, redirectUri) => async dispatch => {
  dispatch({ type: actionTypes.AUTHORIZE_CLIENT })

  try {
    let formData = {
      transaction_id,
      scope,
      redirectUri
    }

    if (allow === true) {
      formData['allow'] = '1'
    } else {
      formData['deny'] = '1'
    }


    let token = localStorage.getItem('access_token')
    let response = await fetch(`/api/oauth2/authorize`, {
      body: JSON.stringify(formData),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      method: 'post',
    })

    response = await response.json()

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.AUTHORIZE_CLIENT,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.AUTHORIZE_CLIENT,
    })

    console.log(error)
  }
}