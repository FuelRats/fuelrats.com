// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'



/* eslint-disable import/prefer-default-export */
// prefer export member for consistency
export const setFlag = (name, _value) => (dispatch) => {
  dispatch({ type: actionTypes.SET_FLAG })

  let value = _value
  let success = true

  if (typeof initialState.flags[name] === 'undefined') {
    success = false
  }

  if (typeof initialState.flags[name] === 'boolean' && typeof value === 'undefined') {
    value = !value
  }

  return dispatch({
    payload: {
      [name]: value,
    },
    status: success ? 'success' : 'error',
    type: actionTypes.SET_FLAG,
  })
}
