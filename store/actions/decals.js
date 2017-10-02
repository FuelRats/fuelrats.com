// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const checkDecalEligibility = () => async dispatch => {
  try {
    dispatch({
      type: actionTypes.CHECK_DECAL_ELIGIBILITY,
    })

    let response = await fetch(`/api/decals/check`, {
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
      status: 'error',
      type: actionTypes.CHECK_DECAL_ELIGIBILITY,
    })

    console.log(error)
  }
}
