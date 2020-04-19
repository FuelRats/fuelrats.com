// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const redeemDecal = () => {
  return frApiRequest(
    actionTypes.decals.redeem,
    { url: '/decals/redeem' },
  )
}
