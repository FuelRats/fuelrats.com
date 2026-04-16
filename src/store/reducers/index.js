import { chainReducers, withDefaultReducers } from '@fuelrats/web-util/reducers'
import { combineReducers } from '@reduxjs/toolkit'

import initialState from '../initialState'
import blogs from './blogs'
import dispatch from './dispatch'
import flags from './flags'
import { reduceJSONAPIResources } from './frAPIResources'
import frSSE from './frSocket'
import images from './images'
import leaderboard from './leaderboard'
import pageViews from './pageViews'
import sapi from './sapi'
import session from './session'
import users from './users'
import wordpress from './wordpress'



export default chainReducers(
  initialState,
  [
    reduceJSONAPIResources,
    frSSE,
    withDefaultReducers(combineReducers)(initialState, {
      blogs,
      dispatch,
      flags,
      images,
      leaderboard,
      pageViews,
      sapi,
      session,
      users,
      wordpress,
    }),
  ],
)
