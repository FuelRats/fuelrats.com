import { createCachedSelector } from 're-reselect'

import { getRatId, selectRatById } from './rats'





export const selectShips = (state) => {
  return state.ships
}


export const selectShipById = (state, { shipId }) => {
  return state.ships[shipId]
}


export const selectShipsByRatId = createCachedSelector(
  [selectRatById, selectShips],
  (rat, ships) => {
    return rat?.relationships.ships.data?.map(({ id }) => {
      return ships[id]
    }) ?? undefined
  },
)(getRatId)
