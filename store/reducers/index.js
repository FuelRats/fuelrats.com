import { combineReducers } from 'redux'
import authentication from './authentication'
import dialog from './dialog'
import paperwork from './paperwork'
import user from './user'
import rescues from './rescues'





export default combineReducers({
  authentication,
  dialog,
  paperwork,
  user,
  rescues,
})
