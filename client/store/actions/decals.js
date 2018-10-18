// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const checkDecalEligibility = () => createApiAction({
  actionType: actionTypes.CHECK_DECAL_ELIGIBILITY,
  url: '/decals/check',
})





export const redeemDecal = () => createApiAction({
  actionType: actionTypes.REDEEM_DECAL,
  url: '/decals/redeem',
})
