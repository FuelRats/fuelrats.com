/* eslint no-await-in-loop:off */
// Module imports
import fetch from 'isomorphic-fetch'
import LocalForage from 'localforage'





// Component imports
import actionTypes from '../actionTypes'
import { ApiError } from '../errors'





export const getRescues = () => async dispatch => {
  dispatch({ type: actionTypes.GET_RESCUES })

  try {
    const token = await LocalForage.getItem('access_token')

    let response = await fetch('/api/rescues', {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      method: 'get',
    })

    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    dispatch({
      rescues: response.data,
      status: 'success',
      total: response.meta.total,
      type: actionTypes.GET_RESCUES,
    })
    return null
  } catch (error) {
    dispatch({
      payload: error,
      status: 'error',
      type: actionTypes.GET_RESCUES,
    })
    return error
  }
}

export const getRescuesByRat = ratId => async dispatch => {
  dispatch({
    rat: ratId,
    type: actionTypes.GET_RESCUES,
  })

  try {
    let response = await fetch(`/api/rescues?rats=${ratId}`)
    response = await response.json()

    if (response.errors) {
      throw new ApiError(response)
    }

    dispatch({
      rat: response.data,
      status: 'success',
      type: actionTypes.GET_RESCUES,
    })

    return null
  } catch (error) {
    dispatch({
      payload: error,
      rat: ratId,
      status: 'error',
      type: actionTypes.GET_RESCUES,
    })

    return error
  }
}

export const getRescuesForCMDRs = CMDRs => async dispatch => {
  // Note. Not fit for use.
  for (const CMDRId of CMDRs) {
    dispatch({
      CMDR: CMDRId,
      type: actionTypes.GET_RESCUES,
    })

    try {
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
