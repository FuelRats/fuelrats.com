import actionTypes from '../actionTypes'





export const showDialog = (options = {}) => dispatch => dispatch({
  options,
  type: actionTypes.DIALOG,
  visible: true,
})





export const hideDialog = () => dispatch => dispatch({
  type: actionTypes.DIALOG,
  visible: false,
})
