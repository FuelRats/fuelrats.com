const selectUserById = (state, { userId }) => (state.users[userId] || null)


const selectAvatarByUserId = (state, props) => {
  const user = selectUserById(state, props)

  if (user) {
    return (user.attributes.image || `//api.adorable.io/avatars/${user.id}`)
  }

  return null
}





export {
  selectUserById,
  selectAvatarByUserId,
}
