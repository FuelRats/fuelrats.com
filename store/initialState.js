export default {
  authentication: {
    loggedIn: false,
    loggingIn: false,
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

  dialog: {
    body: null,
    closeIsVisible: true,
    isVisible: false,
    menuIsVisible: true,
    title: null,
  },

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

  statistics: {
    loadingRescuesByRat: false,
    loadingRescuesBySystem: false,
    loadingRescuesOverTime: false,
    rescuesByRat: [],
    rescuesBySystem: [],
    rescuesOverTime: [],
  },

  user: {
    attributes: null,
    id: null,
    permissions: new Set,
    preferences: {
      allowPersonalizedTracking: false,
    },
    relationships: null,
    retrieving: false,
  },
}
