export default function userHasPermission (groups, permission) {
  return groups.filter(group => group.type === 'groups' && (group.attributes.isAdministrator || group.attributes.permissions.includes(permission))).length > 0
}
