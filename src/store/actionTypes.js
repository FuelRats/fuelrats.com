/* eslint-disable max-classes-per-file */// I know what I'm doing. shut up.

const decals = {
  read: 'decals/read',
  redeem: 'decals/redeem',
}


const epics = {
  read: 'epics/read',
  create: 'epics/create',
}


const leaderboard = {
  read: 'leaderboard/read',
}


const nicknames = {
  create: 'nicknames/create',
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
}





const images = {
  read: 'images/read',
  dispose: 'images/dispose',
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
  readClientOAuthPage: 'session/readClientOAuthPage',
  pageLoading: 'session/pageLoading',
  pageDestroyed: 'session/pageDestroyed',
  setFlag: 'session/setFlag',
}





const stripe = {
  checkout: {
    create: 'stripeCheckout/create',
    read: 'stripeCheckout/read',
  },
}





const wordpress = {
  authors: {
    read: 'wordpressAuthors/read',
  },
  categories: {
    read: 'wordpressCategories/read',
  },
  pages: {
    read: 'wordpressPages/read',
  },
  posts: {
    read: 'wordpressPosts/read',
    search: 'wordpressPosts/search',
  },
}





const actionTypes = {
  // API Resources
  decals,
  epics,
  leaderboard,
  nicknames,
  passwords,
  rats,
  rescues,
  ships,
  users,

  // Special
  images,
  session,

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
