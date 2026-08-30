// OAuth-scope taxonomy for the group-permission grid.
//
// Mirrors the grantable set in api.fuelrats.com `permissions.json`
// (Permission.allPermissions, which feeds isValidOAuthScope). Keep the `oauthScopes`
// map below in sync with that file — the API rejects any scope not listed there (400).
//
// This is NOT permissionNamespaces.js (that file is copy for the OAuth consent screen).

// Friendly labels for each access type (the suffix after `<domain>.`).
const ACCESS_TYPE_LABELS = {
  'read.me': 'Read own',
  read: 'Read all',
  'write.me': 'Write own',
  write: 'Write all',
  verified: 'Verified',
  forcedelete: 'Force-delete',
}

// Column order for the permission grid.
const ACCESS_TYPE_ORDER = ['read.me', 'read', 'write.me', 'write', 'verified', 'forcedelete']

// Friendly labels for each resource domain (grid row headers).
const DOMAIN_LABELS = {
  rescues: 'Rescues',
  rats: 'Rats',
  users: 'Users',
  clients: 'OAuth Clients',
  ships: 'Ships',
  decals: 'Decals',
  epics: 'Epics',
  groups: 'Groups',
  nicknames: 'Nicknames',
  'rescue-revisions': 'Rescue Revisions',
  resources: 'Resources',
  twitter: 'Twitter',
  dispatch: 'Dispatch',
  anope: 'Anope (IRC)',
}

// Domain -> grantable access types. Mirror of permissions.json (14 domains).
const oauthScopes = {
  rescues: ['read.me', 'read', 'write.me', 'write'],
  rats: ['read.me', 'read', 'write.me', 'write'],
  users: ['read.me', 'read', 'write.me', 'write', 'verified'],
  clients: ['read.me', 'read', 'write.me', 'write'],
  ships: ['read.me', 'read', 'write.me', 'write'],
  decals: ['read.me', 'read', 'write.me', 'write'],
  epics: ['read.me', 'read', 'write.me', 'write'],
  groups: ['read', 'write'],
  nicknames: ['read.me', 'read', 'write.me', 'write'],
  'rescue-revisions': ['read', 'write'],
  resources: ['forcedelete'],
  twitter: ['write'],
  dispatch: ['read', 'write'],
  anope: ['read'],
}

const scopeString = (domain, accessType) => {
  return `${domain}.${accessType}`
}

const accessTypeLabel = (accessType) => {
  return ACCESS_TYPE_LABELS[accessType] ?? accessType
}

const domainLabel = (domain) => {
  return DOMAIN_LABELS[domain] ?? domain
}

export {
  ACCESS_TYPE_LABELS,
  ACCESS_TYPE_ORDER,
  DOMAIN_LABELS,
  scopeString,
  accessTypeLabel,
  domainLabel,
}

export default oauthScopes
