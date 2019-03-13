// Module imports
import { createSelector } from 'reselect'



// Component imports
import { selectRatById } from './rats'





const selectShips = (state) => state.ships


const selectShipById = (state, { shipId }) => state.ships[shipId]


const selectShipsByRatId = createSelector(
  [selectRatById, selectShips],
  (rat, ships) => rat.relationships.ships.data.map(({ id }) => ships[id])
)





export {
  selectShips,
  selectShipById,
  selectShipsByRatId,
}
