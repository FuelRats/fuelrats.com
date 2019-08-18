import { frApiRequest } from './services'
import actionTypes from '../actionTypes'

const verifyEmailToken = (token) => frApiRequest(
  actionTypes.VERIFY_EMAIL,
  {
    url: `/verifications/${token}`,
    method: 'get',
  }
)

const verifySessionToken = (token) => frApiRequest(actionTypes.VERIFY_SESSION, {
  url: `/sessions/${token}`,
  method: 'get',
})

const verifyResetToken = (token) => frApiRequest(actionTypes.VERIFY_RESET, {
  url: `/resets/${token}`,
  method: 'get',
})

export { verifyEmailToken, verifySessionToken, verifyResetToken }
