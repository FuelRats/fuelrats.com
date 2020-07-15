import { chainReducers, withDefaultReducers } from '@fuelrats/web-util/reducers'
import { combineReducers } from 'redux'

import initialState from '../initialState'
import blogs from './blogs'
import error from './error'
import flags from './flags'
import { reduceJSONAPIResources } from './frAPIResources'
import images from './images'
import leaderboard from './leaderboard'
import pageViews from './pageViews'
import session from './session'
import wordpress from './wordpress'




export default chainReducers(
  initialState,
  [
    reduceJSONAPIResources,
    withDefaultReducers(combineReducers)(initialState, {
      blogs,
      error,
      flags,
      images,
      leaderboard,
      pageViews,
      session,
      wordpress,
    }),
  ],
)
