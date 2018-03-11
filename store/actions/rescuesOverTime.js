// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const getRescuesOverTimeStatistics = () => async dispatch => {
  dispatch({ type: actionTypes.GET_RESCUES_OVER_TIME })

  let response = null
  let success = false

  try {
    response = await fetch('/api/statistics/rescues')

    success = response.ok
    response = await response.json()
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.GET_RESCUES_OVER_TIME,
  })
}
