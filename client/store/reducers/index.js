import getConfig from 'next/config'
import { combineReducers } from 'redux'





import initialState from '../initialState'
import chainReducers from '../utility/chainReducers'
import withDefaultReducers from '../utility/withDefaultReducers'
import createJSONAPIResourceReducer from './APIResource'


import blogs from './blogs'
import decals from './decals'
import error from './error'
import flags from './flags'
import images from './images'
import leaderboard from './leaderboard'
import pageViews from './pageViews'
import session from './session'
import users from './users'
import wordpress from './wordpress'





const { publicRuntimeConfig } = getConfig()
const localApiUrl = publicRuntimeConfig.apis.fuelRats.local





const apiResourceReducer = createJSONAPIResourceReducer(localApiUrl, initialState, {
  decals: 'decals',
  epics: 'epics',
  groups: 'groups',
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
    resourceReducer: (resource) => {
      return { ...resource, type: 'users' }
    },
  },
})





export default chainReducers(
  initialState,
  [
    apiResourceReducer,
    withDefaultReducers(combineReducers)(initialState, {
      blogs,
      decals,
      error,
      flags,
      images,
      leaderboard,
      pageViews,
      session,
      users,
      wordpress,
    }),
  ],
)
