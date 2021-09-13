import { createCachedSelector } from 're-reselect'

import { getUserIdProp, selectUserById } from './users'





export const selectNicknames = (state) => {
  return state.nicknames
}


export const selectNicknameById = (state, { nicknameId }) => {
  return state.nicknames[nicknameId]
}


export const selectNicknamesByUserId = createCachedSelector(
  [selectUserById, selectNicknames],
  (user, nicknames) => {
    if (user) {
      return user.relationships.nicknames?.data.map(({ id }) => {
        return nicknames[id]
      })
    }
    return []
  },
)(getUserIdProp)
