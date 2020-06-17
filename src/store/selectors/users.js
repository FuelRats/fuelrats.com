// Module imports
import { withCurrentUserId } from './session'





export const selectUserById = (state, { userId }) => {
  return state.users[userId] || null
}


export const selectAvatarByUserId = (state, props) => {
  const user = selectUserById(state, props)

  if (!user) {
    return null
  }

  return user.attributes.image || `//api.adorable.io/avatars/${user.id}`
}


export const selectCurrentUserScopes = (state) => {
  return withCurrentUserId(selectUserById)(state)?.meta?.permissions ?? []
}


export const selectCurrentUserHasScope = (state, { scope }) => {
  const scopes = selectCurrentUserScopes(state)

  return scopes.includes(scope)
}
