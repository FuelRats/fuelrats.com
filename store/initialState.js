export default {
  authentication: {
    loggedIn: false,
    loggingIn: false,
    loggingOut: false,
    registering: false,
  },

  dialog: {
    body: null,
    closeIsVisible: true,
    isVisible: false,
    menuIsVisible: true,
    title: null,
  },

  paperwork: {
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

  ships: {
    ships: [],
    retrieving: false,
    total: 0,
  },

  user: {
    attributes: null,
    id: null,
    permissions: new Set,
    relationships: null,
    retrieving: false,
  },
}
