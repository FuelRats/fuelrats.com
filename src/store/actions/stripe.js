import actionTypes from '../actionTypes'
import { stApiRequest } from './services'





export const createDonationSession = ({ fingerprint, ...data }) => {
  return stApiRequest(
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
