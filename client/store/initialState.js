const initialState = {
  blogs: {
    authors: {},
    blogs: [],
    categories: {},
    total: null,
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
    epics: {},
    retrieving: false,
    total: 0,
  },

  flags: {
    showLoginDialog: false,
  },

  groups: {},

  images: {},

  leaderboard: {
    loading: false,
    statistics: [],
  },

  rats: {},

  rescues: {},

  session: {
    loggedIn: false,
    verifyError: null,
    userId: null,
  },

  ships: {},

  skus: {},

  orders: {
    hasMore: false,
    orders: {},
  },

  pageViews: {},

  products: {
    hasMore: false,
    products: {},
  },

  storeCart: {},

  users: {},

  wordpress: {
    page: {},
  },
}





export default initialState
