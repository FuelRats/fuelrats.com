// Module imports
import { createSelector } from 'reselect'


// Component imports
import { selectRats, selectRatById } from './rats'
import { selectGroups } from './groups'





const selectUser = (state, { userId }) => (state.users[userId] || null)


const selectUserAvatar = (state, props) => {
  const user = selectUser(state, props)

  if (user) {
    return (user.attributes.image || `//api.adorable.io/avatars/${user.id}`)
  }

  return null
}


const selectUserRats = createSelector(
  [selectUser, selectRats],
  (user, rats) => {
    if (user) {
      return user.relationships.rats.data.map(({ id }) => rats[id])
    }
    return null
  },
)


const selectUserDisplayRatId = (state, props) => {
  const user = selectUser(state, props)
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


const selectUserDisplayRat = (state, props) => selectRatById(state, { ratId: selectUserDisplayRatId(state, props) })


const selectUserGroups = createSelector(
  [selectUser, selectGroups],
  (user, groups) => {
    if (user) {
      return user.relationships.groups.data.map(({ id }) => groups[id])
    }
    return []
  },
)


const withCurrentUser = (selector) => (state) => selector(state, { userId: state.authentication.userId })





export {
  selectUser,
  selectUserAvatar,
  selectUserRats,
  selectUserDisplayRat,
  selectUserDisplayRatId,
  selectUserGroups,
  withCurrentUser,
}
