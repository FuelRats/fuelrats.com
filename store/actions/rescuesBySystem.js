// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const getRescuesBySystemStatistics = () => async dispatch => {
  dispatch({ type: actionTypes.GET_RESCUES_BY_SYSTEM })

  let response = null
  let success = false

  try {
    response = await fetch('/api/statistics/systems?count.gt=10')

    success = response.ok
    response = await response.json()
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.GET_RESCUES_BY_SYSTEM,
  })
}
