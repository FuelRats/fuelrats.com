// Module imports
import castArray from 'lodash/castArray'
import intersection from 'lodash/intersection'
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


/**
 * To be moved to `users.js` in APIv3 migration.
 * Profiles in v3 will have an array of scopes we can check from instead of us having to search through groups ourselves.
 * For v2, this unfortunately needs to be located in `groups.js` to avoid a cyclic dependency.
 */
const selectUserByIdHasScope = createSelector(
  [
    selectGroupsByUserId,
    (_state, { scope } = {}) => scope,
  ],
  (userGroups, scope) => {
    if (!userGroups.length || !scope) {
      return false
    }

    return userGroups.some(
      (group) => group.type === 'groups'
        && intersection(
          group.attributes?.permissions ?? [],
          castArray(scope),
        ).length > 0,
    )
  },
)



export {
  selectGroupById,
  selectGroups,
  selectGroupsByUserId,
  selectUserByIdHasScope,
}
