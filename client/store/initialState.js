const initialState = {
  authentication: {
    loggedIn: false,
    loggingIn: true,
    loggingOut: false,
    registering: false,
    verifyError: null,
  },

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

  skus: {},

  orders: {
    hasMore: false,
    orders: {},
  },

  products: {
    hasMore: false,
    products: {},
  },

  storeCart: {},

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





export default initialState
