// Module imports
import { withCurrentUserId } from './session'

const AVATAR_DEFAULT_SIZE = 256

export const getUserId = (_, props) => {
  return props.userId
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


export const selectCurrentUserHasScope = (state, props = {}) => {
  const scopes = selectCurrentUserScopes(state)

  return scopes.includes(props.scope)
}
