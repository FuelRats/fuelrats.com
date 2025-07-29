import actionTypes from '../actionTypes'
import { stripeApiRequest } from './services'





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
