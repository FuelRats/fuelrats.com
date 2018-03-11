// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const getRescuesByRatStatistics = () => async dispatch => {
  dispatch({ type: actionTypes.GET_RESCUES_BY_RAT })

  let response = null
  let success = false

  try {
    response = await fetch('/api/statistics/rats')

    success = response.ok
    response = await response.json()
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.GET_RESCUES_BY_RAT,
  })
}
