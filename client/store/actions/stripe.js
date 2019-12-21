// Component imports
import actionTypes from '../actionTypes'
import { stApiRequest } from './services'





export const createCheckoutSession = () => stApiRequest(
  actionTypes.stripe.checkout.create,
  {
    url: '/checkout/sessions',
    method: 'post',
  },
)





export const getCheckoutSession = (sessionId) => stApiRequest(
  actionTypes.stripe.checkout.read,
  {
    url: `/checkout/sessions/${sessionId}`,
  },
)
