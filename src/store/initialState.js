const initialState = {
  blogs: {
    authors: {},
    blogs: [],
    categories: {},
    total: null,
  },

  decals: {},

  dispatch: {
    board: [],
    closed: [],
    connected: false,
  },

  epics: {},

  flags: {
    showLoginDialog: false,
  },

  groups: {},

  images: {},

  leaderboard: {
    statistics: {},
    entries: [],
  },

  nicknames: {},

  pageViews: {},

  rats: {},

  rescues: {},

  session: {
    error: null,
    loggedIn: false,
    loggingOut: false,
    pageRequiresAuth: false,
    userAgent: '',
    userId: null,
  },

  ships: {},

  users: {},

  'rat-statistics': {},

  wordpress: {
    pages: {},
  },
}





export default initialState
