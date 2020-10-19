import { createSelector } from 'reselect'

import { selectUserById } from './users'





export const selectGroups = (state) => {
  return state.groups
}


export const selectGroupById = (state, { groupId }) => {
  return state.groups[groupId]
}


export const selectGroupsByUserId = createSelector(
  [selectUserById, selectGroups],
  (user, groups) => {
    if (user) {
      return user.relationships.groups.data.map(({ id }) => {
        return groups[id]
      })
    }
    return []
  },
)
