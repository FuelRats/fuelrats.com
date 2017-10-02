// Module imports
import {
  combineReducers,
  createStore,
  applyMiddleware
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'





// Component imports
import actionTypes from './store/actionTypes'
import initialState from './store/initialState'
import reducer from './store/reducers/index'

/* actions */
import * as authenticationActions from './store/actions/authentication'
import * as blogsActions from './store/actions/blogs'
import * as decalsActions from './store/actions/decals'
import * as dialogActions from './store/actions/dialog'
import * as paperworkActions from './store/actions/paperwork'
import * as ratsActions from './store/actions/rats'
import * as rescuesActions from './store/actions/rescues'
import * as rescuesByRatActions from './store/actions/rescuesByRat'
import * as rescuesBySystemActions from './store/actions/rescuesBySystem'
import * as rescuesOverTimeActions from './store/actions/rescuesOverTime'
import * as userActions from './store/actions/user'





export const actions = Object.assign(
  {},
  authenticationActions,
  blogsActions,
  decalsActions,
  dialogActions,
  paperworkActions,
  ratsActions,
  rescuesActions,
  rescuesByRatActions,
  rescuesBySystemActions,
  rescuesOverTimeActions,
  userActions,
)





export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}
