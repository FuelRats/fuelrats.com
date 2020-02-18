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
