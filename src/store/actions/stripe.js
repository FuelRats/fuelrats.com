import actionTypes from '../actionTypes'
import { stApiRequest } from './services'





export const createDonationSession = (data) => {
  return stApiRequest(
    actionTypes.stripe.checkout.create,
    {
      url: '/checkout/donate',
      method: 'post',
      data,
    },
  )
}
