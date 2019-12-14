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

  orders: {},

  pageViews: {},

  products: {
    hasMore: false,
    products: {},
  },

  rats: {},

  rescues: {},

  session: {
    loggedIn: false,
    loggingOut: false,
    error: null,
    userId: null,
  },

  ships: {},

  skus: {},

  storeCart: {},

  users: {},

  wordpress: {
    pages: {},
  },
}





export default initialState
