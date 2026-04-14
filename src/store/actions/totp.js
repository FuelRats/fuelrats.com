import createRequestBody from '~/util/jsonapi/createRequestBody'

import actionTypes from '../actionTypes'
import { selectCurrentUserId, selectSessionToken } from '../selectors'
import { frApiPlainRequest, frApiRequest } from './services'


export const generateTotpSecret = () => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.totp.generate,
      { url: `/users/${userId}/authenticator` },
    ))
  }
}


export const linkTotp = (secret, token, description) => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.totp.link,
      {
        url: `/users/${userId}/authenticator`,
        method: 'post',
        data: createRequestBody('authenticators', { secret, token, description }),
      },
    ))
  }
}


export const removeTotp = (token) => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    const bearerToken = selectSessionToken(getState())
    return dispatch(frApiRequest(
      actionTypes.totp.remove,
      {
        url: `/users/${userId}/authenticator`,
        method: 'delete',
        headers: {
          'X-Verify': token,
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    ))
  }
}
