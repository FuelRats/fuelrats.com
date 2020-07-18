import { HttpMethod } from '@fuelrats/web-util/http'

import actionTypes from '../actionTypes'
import { frApiRequest } from './services'

export const resendVerificationEmail = (email) => {
  return frApiRequest(
    actionTypes.verify.email,
    {
      url: '/verifications',
      method: HttpMethod.POST,
      data: {
        data: {
          type: 'verifications',
          attributes: {
            email,
          },
        },
      },
    },
  )
}

export const verifyEmailToken = (token) => {
  return frApiRequest(
    actionTypes.verify.email,
    {
      url: `/verifications/${token}`,
    },
  )
}


export const verifyResetToken = (token) => {
  return frApiRequest(
    actionTypes.verify.reset,
    {
      url: `/resets/${token}`,
    },
  )
}
