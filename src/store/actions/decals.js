// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const redeemDecal = (user) => {
  return frApiRequest(
    actionTypes.decals.redeem,
    {
      url: `/users/${user.id}/decals`,
      method: 'post',
    },
  )
}
