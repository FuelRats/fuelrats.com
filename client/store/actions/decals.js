// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const checkDecalEligibility = () => frApiRequest(
  actionTypes.decals.read,
  { url: '/decals/check' },
)





export const redeemDecal = () => frApiRequest(
  actionTypes.decals.redeem,
  { url: '/decals/redeem' },
)
