// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'





export const checkDecalEligibility = () => frApiRequest(
  actionTypes.CHECK_DECAL_ELIGIBILITY,
  { url: '/decals/check' }
)





export const redeemDecal = () => frApiRequest(
  actionTypes.REDEEM_DECAL,
  { url: '/decals/redeem' }
)
