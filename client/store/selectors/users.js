const selectUserById = (state, { userId }) => (state.users[userId] || null)





const selectAvatarByUserId = (state, props) => {
  const user = selectUserById(state, props)

  if (!user) {
    return null
  }

  return user.attributes.image || `//api.adorable.io/avatars/${user.id}`
}





export {
  selectUserById,
  selectAvatarByUserId,
}
