// Module imports
import {
  combineReducers,
  createStore,
  applyMiddleware
} from 'redux'
import thunkMiddleware from 'redux-thunk'





// Component imports
import actionTypes from './store/actionTypes'
import initialState from './store/initialState'
import reducer from './store/reducers/index'

/* actions */
import * as authenticationActions from './store/actions/authentication'
import * as dialogActions from './store/actions/dialog'
import * as paperworkActions from './store/actions/paperwork'
import * as ratsActions from './store/actions/rats'
import * as rescuesActions from './store/actions/rescues'





export const actions = Object.assign(
  {},
  authenticationActions,
  dialogActions,
  paperworkActions,
  ratsActions,
  rescuesActions,
)





export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}
