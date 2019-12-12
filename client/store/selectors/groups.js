// Module imports
import { createSelector } from 'reselect'




// Component imports
import { selectUserById } from './users'





const selectGroups = (state) => state.groups


const selectGroupById = (state, { groupId }) => state.groups[groupId]


const selectGroupsByUserId = createSelector(
  [selectUserById, selectGroups],
  (user, groups) => {
    if (user) {
      return user.relationships.groups.data.map(({ id }) => groups[id])
    }
    return []
  },
)





export {
  selectGroupById,
  selectGroups,
  selectGroupsByUserId,
}
