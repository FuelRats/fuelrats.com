import { createCachedSelector } from 're-reselect'

import safeParseInt from '~/util/safeParseInt'


import { withCurrentUserId } from './session'
import { getUserId, selectUserById } from './users'




export const selectDecals = (state) => {
  return state.decals
}


export const selectDecalEligibility = (state) => {
  return state.decals.eligible
}


export const selectDecalById = (state, { decalId } = {}) => {
  return selectDecals(state)[decalId]
}


export const selectUserRedeemableDecals = (state, props) => {
  return safeParseInt(withCurrentUserId(selectUserById)(state, props)?.meta?.redeemable, undefined, 0)
}


export const selectDecalsByUserId = createCachedSelector(
  [selectUserById, selectDecals],
  (user, decals) => {
    if (user) {
      return user.relationships.decals?.data.map(({ id }) => {
        return decals[id]
      })
    }
    return undefined
  },
)(getUserId)
