const initialState = {
  blogs: {
    authors: {},
    blogs: [],
    categories: {},
    totalPages: null,
  },

  clients: {},

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

  sapi: {
    systems: {},
    landmarks: null,
  },

  session: {
    error: null,
    loggedIn: false,
    loggingOut: false,
    pageRequiresAuth: false,
    proxyHeaders: {},
    token: null,
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
