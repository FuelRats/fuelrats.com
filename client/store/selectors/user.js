// Module imports
import { createSelector } from 'reselect'


// Component imports
import { selectRats, selectRatById } from './rats'





const selectUser = (state) => (state.user.attributes ? state.user : null)





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
  let displayRatId = null

  if (state.user.attributes) {
    if (state.user.attributes.displayRatId) {
      ({ displayRatId } = state.user.attributes)
    } else if (state.user.relationships.rats.data.length) {
      displayRatId = state.user.relationships.rats.data[0].id
    }
  }

  if (state.user.displayRatId) {
    return displayRatId
  }

  return displayRatId
}





const selectUserDisplayRat = (state) => selectRatById(state, { ratId: selectUserDisplayRatId(state) })





export {
  selectUser,
  selectUserRats,
  selectUserStats,
  selectUserDisplayRat,
  selectUserDisplayRatId,
}
