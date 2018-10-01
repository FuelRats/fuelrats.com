export default function userHasPermission (groups, permission) {
  if (permission === 'isAdministrator') {
    return groups.some(group => group.attributes.isAdministrator)
  }

  return groups.some(group => group.type === 'groups' && group.attributes.permissions.includes(permission))
}
