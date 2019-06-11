const userHasPermission = (groups, permission) => {
  if (!Array.isArray(groups) || !groups.length) {
    return false
  }

  if (permission === 'isAdministrator') {
    return groups.some((group) => group.attributes.isAdministrator)
  }

  return groups.some((group) => group.type === 'groups' && group.attributes.permissions.includes(permission))
}





export default userHasPermission
