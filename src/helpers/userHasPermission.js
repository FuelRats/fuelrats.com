const userHasPermission = (groups, permission) => {
  if (!Array.isArray(groups) || !groups.length) {
    return false
  }

  if (permission === 'isAdministrator') {
    return groups.some((group) => {
      return group?.attributes?.isAdministrator ?? false
    })
  }

  return groups.some((group) => {
    return group.type === 'groups' && group.attributes.permissions.includes(permission)
  })
}





export default userHasPermission
