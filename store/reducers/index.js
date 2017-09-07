import { combineReducers } from 'redux'
import authentication from './authentication'
import blogs from './blogs'
import dialog from './dialog'
import paperwork from './paperwork'
import user from './user'
import rats from './rats'
import rescues from './rescues'
import rescuesByRat from './rescuesByRat'
import rescuesBySystem from './rescuesBySystem'
import ships from './ships'
import statistics from './statistics'





export default combineReducers({
  authentication,
  blogs,
  dialog,
  paperwork,
  user,
  rats,
  rescues,
  rescuesByRat,
  rescuesBySystem,
  ships,
  statistics,
})
