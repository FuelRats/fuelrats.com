import { createAxiosFSA } from '@fuelrats/web-util/actions'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser'
import { isError } from 'flux-standard-action'
import Cookies from 'js-cookie'

import frApi from '~/services/frApi'
import getFingerprint from '~/util/getFingerprint'
import createRequestBody from '~/util/jsonapi/createRequestBody'

import actionTypes from '../actionTypes'
import { selectCurrentUserId, selectSessionToken } from '../selectors'
import { frApiRequest, frApiPlainRequest } from './services'


const SESSION_TOKEN_LENGTH = 365
const HTTP_OK = 200


export const loginWithPasskey = (email, remember) => {
  return async (dispatch) => {
    const fingerprint = await getFingerprint()

    // Step 1: Get authentication options from API
    const optionsResponse = await frApi.request({
      url: '/passkeys/authenticate',
      method: 'post',
      headers: { 'X-Fingerprint': fingerprint },
      data: createRequestBody('passkey-authentication', { email }),
    })

    if (optionsResponse.status !== HTTP_OK) {
      return dispatch(createAxiosFSA(actionTypes.session.login, optionsResponse))
    }

    // Step 2: Prompt user's authenticator
    const options = optionsResponse.data?.data?.attributes ?? optionsResponse.data
    let credential = null
    try {
      credential = await startAuthentication({ optionsJSON: options })
    } catch {
      return undefined
    }

    // Step 3: Verify with API
    const verifyResponse = await frApi.request({
      url: '/passkeys/verify',
      method: 'post',
      headers: { 'X-Fingerprint': fingerprint },
      data: createRequestBody('passkey-verification', { response: credential }),
    })

    const action = createAxiosFSA(actionTypes.session.login, verifyResponse)

    if (!isError(action)) {
      const token = action.payload?.access_token ?? action.payload?.data?.attributes?.access_token
      if (token) {
        Cookies.set('access_token', token, { expires: remember ? SESSION_TOKEN_LENGTH : null })
      }
    }

    return dispatch(action)
  }
}


export const listPasskeys = () => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.passkeys.search,
      { url: `/users/${userId}/passkeys` },
    ))
  }
}


export const registerPasskey = (name) => {
  return async (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    const token = selectSessionToken(getState())

    // Step 1: Get registration options
    const optionsResponse = await frApi.request({
      url: `/users/${userId}/passkeys/register`,
      headers: { Authorization: `Bearer ${token}` },
    })

    if (optionsResponse.status !== HTTP_OK) {
      return dispatch(createAxiosFSA(actionTypes.passkeys.create, optionsResponse))
    }

    const options = optionsResponse.data?.data?.attributes ?? optionsResponse.data

    // Step 2: Create credential
    let credential = null
    try {
      credential = await startRegistration({ optionsJSON: options })
    } catch (err) {
      // eslint-disable-next-line no-console -- user cancelled or browser rejected
      console.error('Passkey registration failed:', err)
      return undefined
    }

    // Step 3: Send to API
    return dispatch(frApiRequest(
      actionTypes.passkeys.create,
      {
        url: `/users/${userId}/passkeys`,
        method: 'post',
        data: createRequestBody('passkeys', {
          response: credential,
          name,
        }),
      },
    ))
  }
}


export const deletePasskey = (passkeyId) => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.passkeys.delete,
      {
        url: `/users/${userId}/passkeys/${passkeyId}`,
        method: 'delete',
      },
    ))
  }
}
