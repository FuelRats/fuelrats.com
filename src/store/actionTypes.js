const clients = {
  create: 'clients/create',
  search: 'clients/search',
}

const decals = {
  read: 'decals/read',
  redeem: 'decals/redeem',
}


const epics = {
  read: 'epics/read',
  create: 'epics/create',
}


const groups = {
  read: 'groups/read',
  search: 'groups/search',
}


const leaderboard = {
  read: 'leaderboard/read',
}


const nicknames = {
  read: 'nicknames/read',
  create: 'nicknames/create',
  delete: 'nicknames/delete',
}


const rats = {
  read: 'rats/read',
  search: 'rats/search',
  create: 'rats/create',
  delete: 'rats/delete',
  update: 'rats/update',
}


const rescues = {
  read: 'rescues/read',
  search: 'rescues/search',
  create: 'rescues/create',
  delete: 'rescues/delete',
  update: 'rescues/update',
  patchRats: 'rescues/patchRats',
}


const ships = {
  read: 'ships/read',
  search: 'ships/search',
  create: 'ships/create',
  delete: 'ships/delete',
  update: 'ships/update',
}


const users = {
  delete: 'users/delete',
  update: 'users/update',
  statistics: {
    read: 'users/statistics/read',
  },
  avatar: {
    update: 'users/avatar/update',
  },
  email: {
    update: 'users/email/update',
  },
}





const images = {
  read: 'images/read',
  dispose: 'images/dispose',
}





const oauth = {
  authorize: {
    read: 'oauth/authorize/read',
    create: 'oauth/authorize/create',
    delete: 'oauth/authorize/delete',
  },
}





const passwords = {
  reset: 'passwords/reset',
  requestReset: 'passwords/requestReset',
  update: 'passwords/update',
  validateReset: 'passwords/validateReset',
}





const session = {
  login: 'session/login',
  logout: 'session/logout',
  register: 'session/register',
  initialize: 'session/initialize',
  read: 'session/read',
  pageLoading: 'session/page/loading',
  pageDestroyed: 'session/page/destroyed',
  setFlag: 'session/setFlag',
}





const stripe = {
  checkout: {
    create: 'stripeCheckout/create',
    read: 'stripeCheckout/read',
  },
}





const verify = {
  email: 'verify/email',
}





const wordpress = {
  authors: {
    read: 'wordpress/authors/read',
  },
  categories: {
    read: 'wordpress/categories/read',
  },
  pages: {
    read: 'wordpress/pages/read',
  },
  posts: {
    read: 'wordpress/posts/read',
    search: 'wordpress/posts/search',
  },
}





const actionTypes = {
  // API Resources
  clients,
  decals,
  epics,
  groups,
  leaderboard,
  nicknames,
  oauth,
  passwords,
  rats,
  rescues,
  ships,
  users,

  // Special
  images,
  session,
  verify,

  // Services
  stripe,
  wordpress,
}





export default actionTypes





/* Template:

const domain = {
  create: 'domain/create',
  delete: 'domain/delete',
  read: 'domain/read',
  search: 'domain/search',
  update: 'domain/update',
}

*/
