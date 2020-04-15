// Module imports
import { createSelector } from 'reselect'



// Component imports
import { selectRatById } from './rats'





export const selectShips = (state) => {
  return state.ships
}


export const selectShipById = (state, { shipId }) => {
  return state.ships[shipId]
}


export const selectShipsByRatId = createSelector(
  [selectRatById, selectShips],
  (rat, ships) => {
    return rat?.relationships.ships.data?.map(({ id }) => {
      return ships[id]
    }) ?? null
  },
)
