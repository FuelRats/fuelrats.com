// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'





export const checkDecalEligibility = () => frApiRequest(
  actionTypes.decals.read,
  { url: '/decals/check' },
)





export const redeemDecal = () => frApiRequest(
  actionTypes.decals.redeem,
  { url: '/decals/redeem' },
)
