// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'




export const setFlag = (name, value) => async dispatch => {
  dispatch({ type: actionTypes.SET_FLAG })

  let success = true

  if (typeof initialState.flags[name] === 'undefined') {
    success = false
  }

  return dispatch({
    payload: {
      [name]: value,
    },
    status: success ? 'success' : 'error',
    type: actionTypes.SET_FLAG,
  })
}
