// Module imports
import {
  createStore,
  applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'





// Component imports
import initialState from './store/initialState'
import reducer from './store/reducers/index'

/* actions */
import * as authenticationActions from './store/actions/authentication'
import * as blogsActions from './store/actions/blogs'
import * as decalsActions from './store/actions/decals'
import * as epicActions from './store/actions/epics'
import * as flagActions from './store/actions/flags'
import * as ratsActions from './store/actions/rats'
import * as rescuesActions from './store/actions/rescues'
import * as rescuesByRatActions from './store/actions/rescuesByRat'
import * as rescuesBySystemActions from './store/actions/rescuesBySystem'
import * as rescuesOverTimeActions from './store/actions/rescuesOverTime'
import * as userActions from './store/actions/user'
import * as wordpressActions from './store/actions/wordpress'





export const actions = {
  ...authenticationActions,
  ...blogsActions,
  ...decalsActions,
  ...epicActions,
  ...flagActions,
  ...ratsActions,
  ...rescuesActions,
  ...rescuesByRatActions,
  ...rescuesBySystemActions,
  ...rescuesOverTimeActions,
  ...userActions,
  ...wordpressActions,
}





export const initStore = (state = initialState) => createStore(reducer, state, composeWithDevTools(applyMiddleware(thunkMiddleware)))
