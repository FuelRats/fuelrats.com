import { combineReducers } from 'redux'
import authentication from './authentication'
import blogs from './blogs'
import decals from './decals'
import epics from './epics'
import error from './error'
import flags from './flags'
import groups from './groups'
import user from './user'
import rats from './rats'
import rescues from './rescues'
import rescuesByRat from './rescuesByRat'
import rescuesBySystem from './rescuesBySystem'
import rescuesOverTime from './rescuesOverTime'
import ships from './ships'
import skus from './skus'
import orders from './orders'
import products from './products'
import storeCart from './storeCart'
import wordpress from './wordpress'





export default combineReducers({
  authentication,
  blogs,
  decals,
  epics,
  error,
  flags,
  groups,
  user,
  rats,
  rescues,
  rescuesByRat,
  rescuesBySystem,
  rescuesOverTime,
  ships,
  skus,
  orders,
  products,
  storeCart,
  wordpress,
})
