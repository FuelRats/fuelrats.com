import actionTypes from '../actionTypes'





export const showDialog = (options = {}) => dispatch => {
  return dispatch({
    options,
    type: actionTypes.DIALOG,
    visible: true,
  })
}





export const hideDialog = () => dispatch => {
  return dispatch({
    type: actionTypes.DIALOG,
    visible: false,
  })
}
