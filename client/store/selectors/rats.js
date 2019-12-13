import { createSelector } from 'reselect'





import { selectRescueById } from './rescues'
import { selectUserById } from './users'





const selectRats = (state) => state.rats


const selectRatById = (state, { ratId }) => state.rats[ratId]


const selectRatsByRescueId = createSelector(
  [selectRats, selectRescueById],
  (rats, rescue) => {
    if (rats && rescue && rescue.relationships.rats.data && rescue.relationships.rats.data.length) {
      return rescue.relationships.rats.data.map((ratRef) => rats[ratRef.id])
    }
    return null
  },
)


const selectRatsByUserId = createSelector(
  [selectUserById, selectRats],
  (user, rats) => {
    if (user) {
      return user.relationships.rats.data.map(({ id }) => rats[id])
    }
    return null
  },
)


const selectDisplayRatIdByUserId = (state, props) => {
  const user = selectUserById(state, props)
  let ratId = null

  if (user && user.attributes) {
    if (user.attributes.displayRatId) {
      ratId = user.attributes.displayRatId
    } else if (user.relationships.rats.data.length) {
      ratId = user.relationships.rats.data[0].id
    }
  }

  return ratId
}


const selectDisplayRatByUserId = (state, props) => selectRatById(state, { ratId: selectDisplayRatIdByUserId(state, props) })





export {
  selectRatById,
  selectRats,
  selectRatsByRescueId,
  selectRatsByUserId,
  selectDisplayRatByUserId,
  selectDisplayRatIdByUserId,
}
