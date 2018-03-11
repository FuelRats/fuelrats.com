// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'



export const checkDecalEligibility = () => async dispatch => {
  dispatch({ type: actionTypes.CHECK_DECAL_ELIGIBILITY })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch('/api/decals/check', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })

    success = response.ok
    response = await response.json()
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.CHECK_DECAL_ELIGIBILITY,
  })
}





export const redeemDecal = () => async dispatch => {
  dispatch({ type: actionTypes.REDEEM_DECAL })

  let response = null
  let success = false

  try {
    dispatch({
      type: actionTypes.REDEEM_DECAL,
    })

    const token = Cookies.get('access_token')

    response = await fetch('/api/decals/redeem', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })

    success = response.ok
    response = await response.json()
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.REDEEM_DECAL,
  })
}
