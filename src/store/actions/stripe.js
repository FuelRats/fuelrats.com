import { stripeApiRequest } from './services'
import actionTypes from '../actionTypes'





export const createDonationSession = ({ fingerprint, ...data }) => {
  return stripeApiRequest(
    actionTypes.stripe.checkout.create,
    {
      url: '/checkout/donate',
      method: 'post',
      headers: {
        'X-Fingerprint': fingerprint,
      },
      data,
    },
  )
}
