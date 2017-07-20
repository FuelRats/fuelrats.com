import { combineReducers } from 'redux'
import authentication from './authentication'
import dialog from './dialog'
import paperwork from './paperwork'
import user from './user'
import rats from './rats'
import rescues from './rescues'
import ships from './ships'





export default combineReducers({
  authentication,
  dialog,
  paperwork,
  user,
  rats,
  rescues,
  ships,
})
