import actionTypes from '../actionTypes'
import actionStatus from '../actionStatus'





// eslint-disable-next-line import/prefer-default-export
export const notifyPageChange = (path) => (dispatch) => dispatch({
  type: actionTypes.PAGE_CHANGE,
  status: actionStatus.SUCCESS,
  path,
})
