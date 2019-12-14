import { combineReducers } from 'redux'
import getConfig from 'next/config'

import chainReducers from '../utility/chainReducers'
import initialState from '../initialState'
import withDefaultReducers from '../utility/withDefaultReducers'

import createJSONAPIResourceReducer from './APIResource'
import blogs from './blogs'
import error from './error'
import flags from './flags'
import images from './images'
import leaderboard from './leaderboard'
import pageViews from './pageViews'
import products from './products'
import session from './session'
import skus from './skus'
import storeCart from './storeCart'
import users from './users'
import wordpress from './wordpress'





const { publicRuntimeConfig } = getConfig()
const localApiUrl = publicRuntimeConfig.apis.fuelRats.local





const apiResourceReducer = createJSONAPIResourceReducer(localApiUrl, initialState, {
  decals: 'decals',
  epics: 'epics',
  groups: 'groups',
  order: 'orders',
  rats: {
    target: 'rats',
    dependencies: [{
      type: 'users',
      idAttribute: 'userId',
    }],
  },
  rescues: 'rescues',
  ships: {
    target: 'ships',
    dependencies: [{
      type: 'rats',
      idAttribute: 'ratId',
    }],
  },
  users: 'users',
  profiles: {
    target: 'users',
    resourceReducer: (resource) => ({ ...resource, type: 'users' }),
  },
})





export default chainReducers(
  initialState,
  [
    apiResourceReducer,
    withDefaultReducers(combineReducers)(initialState, {
      blogs,
      error,
      flags,
      images,
      leaderboard,
      pageViews,
      products,
      session,
      skus,
      storeCart,
      users,
      wordpress,
    }),
  ],
)
