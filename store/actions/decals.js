// Module imports
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'





// Component imports
import actionTypes from '../actionTypes'
import { ApiError } from '../errors'




export const checkDecalEligibility = () => async dispatch => {
  try {
    dispatch({
      type: actionTypes.CHECK_DECAL_ELIGIBILITY,
    })

    const token = await LocalForage.getItem('access_token')

    let response = await fetch('/api/decals/check', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.CHECK_DECAL_ELIGIBILITY,
    })
    return null
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.CHECK_DECAL_ELIGIBILITY,
    })
    return error
  }
}





export const redeemDecal = () => async dispatch => {
  try {
    dispatch({
      type: actionTypes.REDEEM_DECAL,
    })

    const token = await LocalForage.getItem('access_token')

    let response = await fetch('/api/decals/redeem', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    dispatch({
      payload: response,
      status: 'success',
      type: actionTypes.REDEEM_DECAL,
    })
    return null
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.REDEEM_DECAL,
    })
    return error
  }
}
