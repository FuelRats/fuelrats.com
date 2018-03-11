// Module imports
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const getRescues = () => async dispatch => {
  dispatch({ type: actionTypes.GET_RESCUES })

  let response = null
  let success = false

  try {
    const token = Cookies.get('access_token')

    response = await fetch('/api/rescues', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'get',
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
    type: actionTypes.GET_RESCUES,
  })
}

export const getRescuesByRat = ratId => async dispatch => {
  dispatch({ rat: ratId, type: actionTypes.GET_RESCUES })

  let response = null
  let success = false

  try {
    response = await fetch(`/api/rescues?rats=${ratId}`)

    success = response.ok
    response = await response.json()
  } catch (error) {
    success = false
    response = error
  }

  return dispatch({
    payload: response,
    status: success ? 'success' : 'error',
    type: actionTypes.GET_RESCUES,
  })
}

export const getRescuesForCMDRs = CMDRs => async dispatch => {
  // Note. Not fit for use.
  for (const CMDRId of CMDRs) {
    dispatch({ CMDR: CMDRId, type: actionTypes.GET_RESCUES })

    try {
      /* eslint-disable no-await-in-loop */
      const responses = await Promise.all([
        // Assists
        fetch(`/api/rescues?outcome=success&rats=${CMDRId}`).then(response => response.json()),

        // Failures
        fetch(`/api/rescues?outcome=failure&rats=${CMDRId}`).then(response => response.json()),

        // First Limpets
        fetch(`/api/rescues?outcome=success&firstLimpet=${CMDRId}`).then(response => response.json()),

        // Rescues
        fetch(`/api/rescues?rats=${CMDRId}`).then(response => response.json()),
      ])

      for (let index = 0, { length } = responses; index < length; index++) {
        responses[index] = await responses[index].json()
      }
      /* eslint-enable no-await-in-loop */

      const assistCount = responses[0].meta.total
      const failureCount = responses[1].meta.total
      const firstLimpetCount = responses[2].meta.total
      const rescueCount = responses[3].meta.total

      dispatch({
        assistCount,
        CMDR: CMDRId,
        failureCount,
        firstLimpetCount,
        rescueCount,
        status: 'success',
        type: actionTypes.GET_RESCUES,
      })
    } catch (error) {
      dispatch({
        payload: error,
        status: 'error',
        type: actionTypes.GET_RESCUES,
      })
    }
  }
}
