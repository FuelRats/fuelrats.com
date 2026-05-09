import actionTypes from '../actionTypes'
import { selectCurrentUserId } from '../selectors'
import { frApiPlainRequest } from './services'


export const getMemoMail = () => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.memoMail.read,
      { url: `/users/${userId}/memo-mail` },
    ))
  }
}


export const setMemoMail = (enabled) => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.memoMail.update,
      {
        url: `/users/${userId}/memo-mail`,
        method: 'put',
        data: {
          data: {
            type: 'memo-mail',
            attributes: { enabled },
          },
        },
      },
    ))
  }
}
