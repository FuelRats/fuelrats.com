// Module imports
import { createSelector } from 'reselect'



// Component imports
import { selectRatById } from './rats'





const selectShips = (state) => state.ships


const selectShipById = (state, { shipId }) => state.ships[shipId]


const selectShipsByRatId = createSelector(
  [selectRatById, selectShips],
  (rat, ships) => {
    if (!rat || !rat.relationships.ships.data) {
      return null
    }

    return rat.relationships.ships.data.map(({ id }) => ships[id])
  }
)





export {
  selectShips,
  selectShipById,
  selectShipsByRatId,
}
