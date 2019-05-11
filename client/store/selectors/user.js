// Module imports
import { createSelector } from 'reselect'


// Component imports
import { selectRats, selectRatById } from './rats'





const selectUser = (state) => (state.user.attributes ? state.user : null)



const selectUserId = (state) => state.user.id



const selectUserRats = createSelector(
  [selectUser, selectRats],
  (user, rats) => {
    if (user) {
      return user.relationships.rats.data.map(({ id }) => rats[id])
    }
    return null
  }
)





const selectUserDisplayRatId = (state) => {
  let ratId = null

  if (state.user.attributes) {
    if (state.user.attributes.displayRatId) {
      ratId = state.user.attributes.displayRatId
    } else if (state.user.relationships.rats.data.length) {
      ratId = state.user.relationships.rats.data[0].id
    }
  }

  return ratId
}





const selectUserDisplayRat = (state) => selectRatById(state, { ratId: selectUserDisplayRatId(state) })





export {
  selectUser,
  selectUserId,
  selectUserRats,
  selectUserDisplayRat,
  selectUserDisplayRatId,
}
