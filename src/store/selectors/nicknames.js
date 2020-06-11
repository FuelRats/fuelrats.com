import { createSelector } from 'reselect'

import { selectUserById } from './users'





export const selectNicknames = (state) => {
  return state.nicknames
}


export const selectNicknameById = (state, { nicknameId }) => {
  return state.nicknames[nicknameId]
}


export const selectNicknamesByUserId = createSelector(
  [selectUserById, selectNicknames],
  (user, nicknames) => {
    if (user) {
      return user.relationships.nicknames?.data.map(({ id }) => {
        return nicknames[id]
      })
    }
    return []
  },
)
