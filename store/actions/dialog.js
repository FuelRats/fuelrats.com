import actionTypes from '../actionTypes'





export const showDialog = (options = {}) => dispatch => {
  return dispatch({
    options,
    type: actionTypes.SHOW_DIALOG,
  })
}





export const hideDialog = () => dispatch => {
  return dispatch({
    type: actionTypes.HIDE_DIALOG,
  })
}
