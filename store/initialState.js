export default {
  authentication: {
    loggedIn: false,
    loggingIn: true,
    loggingOut: false,
    registering: false,
    verifyError: null,
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
    showLoginDialog: false,
  },

  groups: {},

  rats: {
    rats: [],
    retrieving: false,
  },

  rescues: {},

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
    relationships: null,
    retrieving: false,
  },

  wordpress: {
    page: {},
  },
}
