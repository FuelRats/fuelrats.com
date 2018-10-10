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
import initialState from './store/initialState'
import reducer from './store/reducers/index'

// actions
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
import * as storeCartActions from './store/actions/storeCart'
import * as stripeActions from './store/actions/stripe'
import * as userActions from './store/actions/user'
import * as wordpressActions from './store/actions/wordpress'





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





const connectDecorator = target => {
  const {
    mapDispatchToProps: mDTP,
    mapStateToProps,
    mergeProps,
    reduxOptions,
  } = target
  let mapDispatchToProps = mDTP

  if (Array.isArray(mDTP)) {
    mapDispatchToProps = dispatch => bindActionCreators(
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
  getActionCreators,
  connectDecorator as connect,
  initStore,
}
