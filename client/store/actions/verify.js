import { frApiRequest } from './services'
import actionTypes from '../actionTypes'

export const verifyEmailToken = (token) => frApiRequest(
  actionTypes.VERIFY_EMAIL,
  {
    url: `/verifications/${token}`,
    method: 'get',
  }
)

export const verifySessionToken = (token) => frApiRequest(actionTypes.VERIFY_SESSION, {
  url: `/sessions/${token}`,
  method: 'get',
})

export const verifyResetToken = (token) => frApiRequest(actionTypes.VERIFY_RESET, {
  url: `/resets/${token}`,
  method: 'get',
})
