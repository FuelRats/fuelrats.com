// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'
import { ApiError } from '../errors'





export const getRescuesOverTimeStatistics = () => async dispatch => {
  dispatch({ type: actionTypes.GET_RESCUES_OVER_TIME })

  try {
    let response = await fetch('/api/statistics/rescues')

    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    dispatch({
      payload: response.data,
      status: 'success',
      type: actionTypes.GET_RESCUES_OVER_TIME,
    })
    return null
  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.GET_RESCUES_OVER_TIME,
    })
    return error
  }
}
