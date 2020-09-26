import { createSelector } from 'reselect'

import { selectUserById } from './users'




export const selectDecals = (state) => {
  return state.decals
}


export const selectDecalEligibility = (state) => {
  return state.decals.eligible
}


export const selectDecalById = (state, { decalId } = {}) => {
  return selectDecals(state)[decalId]
}


export const selectDecalsByUserId = createSelector(
  [selectDecals, selectUserById],
  (decals, user) => {
    if (user) {
      return user.relationships.decals?.data.map(({ id }) => {
        return decals[id]
      })
    }
    return undefined
  },
)
