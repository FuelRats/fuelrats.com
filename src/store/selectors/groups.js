// Module imports
import castArray from 'lodash/castArray'
import intersection from 'lodash/intersection'
import { createSelector } from 'reselect'





// Component imports
import { selectUserById } from './users'





const getScope = (_, props) => {
  return props?.scope ?? null
}





export const selectGroups = (state) => {
  return state.groups
}


export const selectGroupById = (state, { groupId }) => {
  return state.groups?.[groupId]
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


/*
 * To be moved to `users.js` in APIv3 migration.
 * Profiles in v3 will have an array of scopes we can check from instead of us having to search through groups ourselves.
 * For v2, this unfortunately needs to be located in `groups.js` to avoid a cyclic dependency.
 */
export const selectUserByIdHasScope = createSelector(
  [selectGroupsByUserId, getScope],
  (userGroups, scope) => {
    if (!userGroups.length || !scope) {
      return false
    }

    return userGroups.some(
      (group) => {
        return group.type === 'groups'
        && intersection(
          group.attributes?.permissions ?? [],
          castArray(scope),
        ).length > 0
      },
    )
  },
)
