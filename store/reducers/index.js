import { combineReducers } from 'redux'
import authentication from './authentication'
import blogs from './blogs'
import decals from './decals'
import dialog from './dialog'
import epics from './epics'
import paperwork from './paperwork'
import user from './user'
import rats from './rats'
import rescues from './rescues'
import rescuesByRat from './rescuesByRat'
import rescuesBySystem from './rescuesBySystem'
import rescuesOverTime from './rescuesOverTime'
import ships from './ships'





export default combineReducers({
  authentication,
  blogs,
  decals,
  dialog,
  epics,
  paperwork,
  user,
  rats,
  rescues,
  rescuesByRat,
  rescuesBySystem,
  rescuesOverTime,
  ships,
})
