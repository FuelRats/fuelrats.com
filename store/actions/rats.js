// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const getRats = ratIds => async dispatch => {
  for (let ratId of ratIds) {
    try {
      dispatch({
        rat: ratId,
        type: actionTypes.GET_RAT,
      })

      let response = await fetch(`/api/rats/${ratId}`)
      response = await response.json()

      dispatch({
        rat: response.data,
        status: 'success',
        type: actionTypes.GET_RAT,
      })

    } catch (error) {
      dispatch({
        rat: ratId,
        status: 'error',
        type: actionTypes.GET_RAT,
      })

      console.log(error)
    }
  }
}
