import actionTypes from '../actionTypes'
import { selectCurrentUserId } from '../selectors'
import { frApiPlainRequest } from './services'


export const listSessions = () => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.sessions.list,
      { url: `/users/${userId}/sessions` },
    ))
  }
}


export const revokeSession = (sessionId) => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.sessions.revoke,
      {
        url: `/users/${userId}/sessions/${sessionId}`,
        method: 'delete',
      },
    ))
  }
}
