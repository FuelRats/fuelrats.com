// Component imports
import actionTypes from '../actionTypes'
import { stApiRequest } from './services'





export const createDonationSession = (data) => stApiRequest(
  actionTypes.stripe.checkout.create,
  {
    url: '/checkout/donate',
    method: 'post',
    data,
  },
)





export const getCheckoutSession = (sessionId) => stApiRequest(
  actionTypes.stripe.checkout.read,
  {
    url: `/checkout/sessions/${sessionId}`,
  },
)
