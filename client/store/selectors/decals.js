import { createSelector } from 'reselect'





const selectDecals = (state) => state.decals


const selectDecalById = (state, { decalId } = {}) => selectDecals(state)[decalId]


const selectDecalsByUserId = createSelector(
  [
    selectDecals,
    (state, props = {}) => props.userId,
  ],
  (decals, userId) => Object.values(decals).filter((decal) => decal.attributes.userId === userId),
)





export {
  selectDecalById,
  selectDecals,
  selectDecalsByUserId,
}
