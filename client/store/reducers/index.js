import { combineReducers } from 'redux'





import authentication from './authentication'
import blogs from './blogs'
import decals from './decals'
import epics from './epics'
import error from './error'
import flags from './flags'
import groups from './groups'
import leaderboard from './leaderboard'
import orders from './orders'
import pageViews from './pageViews'
import products from './products'
import rats from './rats'
import rescues from './rescues'
import ships from './ships'
import skus from './skus'
import storeCart from './storeCart'
import user from './user'
import wordpress from './wordpress'





export default combineReducers({
  authentication,
  blogs,
  decals,
  epics,
  error,
  flags,
  groups,
  leaderboard,
  orders,
  pageViews,
  products,
  rats,
  rescues,
  ships,
  skus,
  storeCart,
  user,
  wordpress,
})
