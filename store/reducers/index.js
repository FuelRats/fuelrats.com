import { combineReducers } from 'redux'
import authentication from './authentication'
import blogs from './blogs'
import dialog from './dialog'
import paperwork from './paperwork'
import user from './user'
import rats from './rats'
import rescues from './rescues'
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
  ships,
  statistics,
})
