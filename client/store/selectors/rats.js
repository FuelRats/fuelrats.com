import { createSelector } from 'reselect'
import { selectRescueById } from './rescues'

const selectRats = (state) => state.rats

const selectRatById = (state, { ratId }) => state.rats[ratId]


const selectRatsByRescueId = createSelector(
  [selectRats, selectRescueById],
  (rats, rescue) => rescue.relationships.rats.data && rescue.relationships.rats.data.length && rescue.relationships.rats.data.map((ratRef) => rats[ratRef.id])
)


export {
  selectRatById,
  selectRats,
  selectRatsByRescueId,
}
