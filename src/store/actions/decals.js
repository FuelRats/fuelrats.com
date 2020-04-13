// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const checkDecalEligibility = () => {
  return frApiRequest(
    actionTypes.decals.read,
    { url: '/decals/check' },
  )
}





export const redeemDecal = () => {
  return frApiRequest(
    actionTypes.decals.redeem,
    { url: '/decals/redeem' },
  )
}
