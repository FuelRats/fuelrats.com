export default {
  authentication: {
    loggedIn: false,
    loggingIn: true,
    loggingOut: false,
    registering: false,
  },

  blogs: {
    blogs: [],
    totalPages: 0,
  },

  decals: {
    decals: [],
    eligible: false,
  },

  error: {
    errors: [],
    hasError: false,
  },

  epics: {
    epics: [],
    retrieving: false,
    total: 0,
  },

  flags: {
    openSubNav: '',
    showLoginDialog: false,
  },

  groups: {},

  paperwork: {
    rescueId: null,
    retrieving: true,
    submitting: false,
  },

  rats: {
    rats: [],
    retrieving: false,
    total: 0,
  },

  rescues: {
    rescues: [],
    retrieving: false,
    total: 0,
  },

  rescuesByRat: {
    loading: false,
    statistics: [],
  },

  rescuesBySystem: {
    loading: false,
    statistics: [],
  },

  rescuesOverTime: {
    loading: false,
    statistics: [],
  },

  ships: {
    ships: [],
    retrieving: false,
    total: 0,
  },

  user: {
    attributes: null,
    id: null,
    permissions: new Set,
    preferences: {
      allowUniversalTracking: false,
    },
    relationships: null,
    retrieving: false,
  },
}
