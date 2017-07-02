// Module imports
import fetch from 'isomorphic-fetch'





// Component imports
import actionTypes from '../actionTypes'





export const getRescues = () => async dispatch => {
  dispatch({ type: actionTypes.GET_RESCUES })

  try {
    let response = await fetch(`/api/rescues`, {
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }),
      method: 'get',
    })

    response = await response.json()

    dispatch({
      rescues: response.data,
      status: 'success',
      total: response.meta.total,
      type: actionTypes.GET_RESCUES,
    })

  } catch (error) {
    dispatch({
      status: 'error',
      type: actionTypes.GET_RESCUES,
    })

    console.log(error)
  }
}

export const getRescuesByRat = ratId => dispatch => {
  dispatch({
    rat: ratId,
    type: actionTypes.GET_RESCUES,
  })

  return fetch(`/api/rescues?rats=${ratId}`)
  .then(response => response.json())
  .then(response => {
    dispatch({
      rat: response.data,
      status: 'success',
      type: actionTypes.GET_RESCUES,
    })
  })
  .catch(error => {
    dispatch({
      rat: ratId,
      status: 'error',
      type: actionTypes.GET_RESCUES,
    })

    console.log(error)
  })
}

export const getRescuesForCMDRs = CMDRs => async dispatch => {
  for (let CMDRId of CMDRs) {
    dispatch({
      CMDR: CMDRId,
      type: actionTypes.GET_RESCUES,
    })

    try {
      let responses = await Promise.all([
        // Assists
        fetch(`/api/rescues?successful=true&rats=${CMDRId}`),

        // Failures
        fetch(`/api/rescues?successful=false&rats=${CMDRId}`),

        // First Limpets
        fetch(`/api/rescues?successful=true&firstLimpet=${CMDRId}`),

        // Rescues
        fetch(`/api/rescues?rats=${CMDRId}`),
      ])

      for (let index = 0, length = responses.length; index < length; index++) {
        responses[index] = await responses[index].json()
      }

      let assistCount = responses[0].meta.total
      let failureCount = responses[1].meta.total
      let firstLimpetCount = responses[2].meta.total
      let rescueCount = responses[3].meta.total

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
        status: 'error',
        type: actionTypes.GET_RESCUES,
      })

      console.log(error)
    }
  }
}
