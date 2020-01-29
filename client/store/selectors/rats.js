import { createSelector } from 'reselect'





import { selectUserById } from './users'





const selectRats = (state) => state.rats


const selectRatById = (state, { ratId }) => state.rats[ratId]


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
  selectRatsByUserId,
  selectDisplayRatByUserId,
  selectDisplayRatIdByUserId,
}
