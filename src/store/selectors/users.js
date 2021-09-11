import { createCachedSelector } from 're-reselect'

import includesAll from '~/util/array/includesAll'
import includesSome from '~/util/array/includesSome'

import { withCurrentUserId } from './session'





const AVATAR_DEFAULT_SIZE = 256





const getScope = (_, props) => {
  return props?.scope
}

export const getUserId = (_, props) => {
  return props?.userId
}





export const selectUserById = (state, props = {}) => {
  return state.users[props.userId] ?? undefined
}

export const selectUserRatsRelationship = (state, props) => {
  return selectUserById(state, props)?.relationships.rats?.data ?? undefined
}

export const selectUserDisplayRatRelationship = (state, props) => {
  return selectUserById(state, props)?.relationships.displayRat?.data ?? undefined
}

export const selectAvatarByUserId = (state, props) => {
  const user = selectUserById(state, props)

  if (!user) {
    return undefined
  }

  return user.relationships?.avatar?.data
    ? `/api/fr/users/${user.id}/image?v=${user.relationships.avatar.data.id}`
    : `/api/avatars/${user.id}/${props.size ?? AVATAR_DEFAULT_SIZE}`
}

export const selectCurrentUserScopes = (state) => {
  return withCurrentUserId(selectUserById)(state)?.meta?.permissions ?? []
}

/**
 * @param {object} state
 * @param {object} props
 * @param {string|string[]|object} props.scope
 * @param {string[]} props.scope.and
 * @param {string[]} props.scope.or
 * @returns {boolean}
 */
export const selectCurrentUserHasScope = createCachedSelector(
  [
    selectCurrentUserScopes,
    getScope,
  ],
  (userScopes, scope) => {
    if (!scope) {
      // falsy scope should be interpreted as no required scope, and threfore always true.
      return true
    }

    if (typeof scope !== 'string') {
      if (Array.isArray(scope)) {
        // Arrays should implicity mean "all listed scopes"
        return includesAll(userScopes, scope)
      }

      if (typeof scope === 'object') {
        if (Array.isArray(scope.and)) {
          return includesAll(userScopes, scope.and)
        }

        if (Array.isArray(scope.or)) {
          return includesSome(userScopes, scope.or)
        }

        throw new Error('Expected object `scope` to contain property of type `string[]` named `and` or `or`.')
      }


      throw new Error('Expected prop `scope` to be one of type `string`, `string[]`, or `object`.')
    }

    return userScopes.includes(scope)
  },
)(
  (_, props) => {
    switch (typeof props.scope) {
      case 'string':
        return props.scope

      case 'undefined':
        return 'undefined'

      default:
        return JSON.stringify(props.scope)
    }
  },
)
