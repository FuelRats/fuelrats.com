import { combineReducers } from 'redux'
import authentication from './authentication'
import dialog from './dialog'
import user from './user'





export default combineReducers({
  authentication,
  dialog,
  user,
})
