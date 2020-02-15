import { createSelector } from 'reselect'
import { selectRats } from './rats'





export const selectRescues = (state) => {
  return state.rescues.rescues
}


export const selectRescueById = (state, { rescueId }) => {
  return state.rescues[rescueId]
}


export const selectRatsByRescueId = createSelector(
  [selectRats, selectRescueById],
  (rats, rescue) => {
    if (rats) {
      return rescue?.relationships?.rats?.data?.map((ratRef) => {
        return rats[ratRef.id]
      }) ?? null
    }
    return null
  },
)
