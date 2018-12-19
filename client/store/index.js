// Module imports
import {
  bindActionCreators,
  createStore,
  applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connect } from 'react-redux'
import thunkMiddleware from 'redux-thunk'





// Component imports
import initialState from './initialState'
import reducer from './reducers/index'
import actionStatus from './actionStatus'



// Action imports
import * as authenticationActions from './actions/authentication'
import * as blogsActions from './actions/blogs'
import * as decalsActions from './actions/decals'
import * as epicActions from './actions/epics'
import * as flagActions from './actions/flags'
import * as ratsActions from './actions/rats'
import * as rescuesActions from './actions/rescues'
import * as rescuesByRatActions from './actions/rescuesByRat'
import * as rescuesBySystemActions from './actions/rescuesBySystem'
import * as rescuesOverTimeActions from './actions/rescuesOverTime'
import * as storeCartActions from './actions/storeCart'
import * as stripeActions from './actions/stripe'
import * as userActions from './actions/user'
import * as wordpressActions from './actions/wordpress'





const actions = {
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
  ...storeCartActions,
  ...stripeActions,
  ...userActions,
  ...wordpressActions,
}





const initStore = (state = initialState) => createStore(reducer, state, composeWithDevTools(applyMiddleware(thunkMiddleware)))





const connectDecorator = (target) => {
  const {
    mapDispatchToProps: mDTP,
    mapStateToProps,
    mergeProps,
    reduxOptions,
  } = target
  let mapDispatchToProps = mDTP

  if (Array.isArray(mDTP)) {
    mapDispatchToProps = (dispatch) => bindActionCreators(
      mDTP.reduce((acc, actionName) => ({
        ...acc,
        [actionName]: actions[actionName],
      }
      ), {}),
      dispatch
    )
  }

  return connect(
    mapStateToProps || (() => ({})),
    mapDispatchToProps || {},
    mergeProps,
    reduxOptions
  )(target)
}





const getActionCreators = (action, dispatch) => {
  let resolvedAction = action

  if (Array.isArray(action) && typeof action[0] === 'string') {
    resolvedAction = action.reduce((acc, actionName) => ({
      ...acc,
      [actionName]: actions[actionName],
    }), {})
  }

  if (typeof action === 'string') {
    resolvedAction = actions[action]
  }

  return bindActionCreators(resolvedAction, dispatch)
}





export {
  actions,
  actionStatus,
  getActionCreators,
  connectDecorator as connect,
  initStore,
}
