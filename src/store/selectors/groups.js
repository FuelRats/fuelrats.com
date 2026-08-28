import { createCachedSelector } from 're-reselect'

import { getUserIdProp, selectUserById } from './users'





export const selectGroups = (state) => {
  return state.groups
}


export const selectGroupById = (state, { groupId }) => {
  return state.groups[groupId]
}


export const selectGroupsByUserId = createCachedSelector(
  [selectUserById, selectGroups],
  (user, groups) => {
    if (user) {
      return (user.relationships.groups?.data ?? [])
        .map(({ id }) => {
          return groups[id]
        })
        .filter(Boolean)
        .sort((groupA, groupB) => {
          return (groupB.attributes.priority ?? 0) - (groupA.attributes.priority ?? 0)
            || groupA.attributes.name.localeCompare(groupB.attributes.name)
        })
    }
    return []
  },
)(getUserIdProp)
