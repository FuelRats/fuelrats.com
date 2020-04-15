import { createSelector } from 'reselect'





const getUserId = (_, props) => {
  return props?.userId ?? null
}





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
  [selectDecals, getUserId],
  (decals, userId) => {
    return Object.values(decals).filter((decal) => {
      return decal.attributes && decal.attributes.userId === userId
    })
  },
)
