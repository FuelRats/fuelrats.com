import { createCachedSelector } from 're-reselect'

import { includesAll, includesSome } from '~/helpers/arrIncludes'

import { withCurrentUserId } from './session'





const AVATAR_DEFAULT_SIZE = 256





const getScope = (_, props) => {
  return props?.scope
}

export const getUserId = (_, props) => {
  return props?.userId
}





export const selectUserById = (state, props = {}) => {
  return state.users[props.userId] || null
}

export const selectUserRatsRelationship = (state, props) => {
  return selectUserById(state, props)?.relationships.rats?.data ?? null
}

export const selectUserDisplayRatRelationship = (state, props) => {
  return selectUserById(state, props)?.relationships.displayRat?.data ?? null
}

export const selectAvatarByUserId = (state, props) => {
  const user = selectUserById(state, props)

  if (!user) {
    return null
  }

  return user.attributes.image ? `/api/users/${user.id}/avatar` : `/avatars/${props.size ?? AVATAR_DEFAULT_SIZE}/${user.id}`
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
    if (typeof scope !== 'string') {
      if (Array.isArray(scope)) {
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
    return (
      typeof props.scope === 'string'
        ? props.scope
        : JSON.stringify(props.scope)
    )
  },
)
