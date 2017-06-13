import { combineReducers } from 'redux'
import authentication from './authentication'
import dialog from './dialog'





export default combineReducers({
  authentication,
  dialog,
})
