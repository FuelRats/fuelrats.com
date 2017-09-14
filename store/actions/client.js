// Module imports
import fetch from 'isomorphic-fetch'


// Component imports
import actionTypes from '../actionTypes'




export const authorize = (transactionId, scope, allow, redirectUri) => async dispatch => {
  dispatch({ type: actionTypes.AUTHORIZE_CLIENT })

  try {
    let data = {
      transactionId,
      scope
    }
    data[allow === true ? 'allow' : 'deny'] = '1'

    let response = await fetch(`/api/oauth2/authorize`, {
      body: JSON.stringify(data),
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }),
      method: 'put',
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