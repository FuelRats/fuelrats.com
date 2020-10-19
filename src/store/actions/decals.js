import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const redeemDecal = (id) => {
  return frApiRequest(
    actionTypes.decals.redeem,
    {
      url: `/users/${id}/decals`,
      method: 'post',
    },
  )
}
