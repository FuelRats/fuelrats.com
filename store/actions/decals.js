// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const checkDecalEligibility = () => async dispatch => {
  try {
    dispatch({
      type: actionTypes.CHECK_DECAL_ELIGIBILITY,
    })

    let response = await fetch('/api/decals/check', {
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }),
    })
    response = await response.json()

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.CHECK_DECAL_ELIGIBILITY,
    })
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.CHECK_DECAL_ELIGIBILITY,
    })
  }
}





export const redeemDecal = () => async dispatch => {
  try {
    dispatch({
      type: actionTypes.REDEEM_DECAL,
    })

    let response = await fetch('/api/decals/redeem', {
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }),
    })
    response = await response.json()

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.REDEEM_DECAL,
    })
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.REDEEM_DECAL,
    })
  }
}
