const initialState = {
  blogs: {
    authors: {},
    blogs: [],
    categories: {},
    total: null,
  },

  decals: {},

  error: {
    errors: [],
    hasError: false,
  },

  epics: {},

  flags: {
    showLoginDialog: false,
  },

  groups: {},

  images: {},

  leaderboard: {
    loading: false,
    statistics: [],
  },

  pageViews: {},

  rats: {},

  rescues: {},

  session: {
    loggedIn: false,
    loggingOut: false,
    error: null,
    userAgent: '',
    userId: null,
  },

  ships: {},

  users: {},

  wordpress: {
    pages: {},
  },
}





export default initialState
