/* globals $IS_DEVELOPMENT:false */
// Module imports

import { errorLoggerMiddleware, FSAComplianceMiddleware } from '@fuelrats/web-util/redux-middleware'
import { connect } from 'react-redux'
import {
  bindActionCreators,
  createStore,
  applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'





// Component imports

import * as authenticationActions from './actions/authentication'
import * as blogActions from './actions/blogs'
import * as decalActions from './actions/decals'
import * as epicActions from './actions/epics'
import * as flagActions from './actions/flags'
import * as imageActions from './actions/images'
import * as leaderboardActions from './actions/leaderboard'
import * as ratActions from './actions/rats'
import * as rescueActions from './actions/rescues'
import * as serviceActions from './actions/services'
import * as sessionActions from './actions/session'
import * as shipActions from './actions/ships'
import * as stripeActions from './actions/stripe'
import * as userActions from './actions/user'
import * as verifyActions from './actions/verify'
import * as wordpressActions from './actions/wordpress'
import actionTypes from './actionTypes'
import initialState from './initialState'
import reducer from './reducers'

const actions = {
  ...authenticationActions,
  ...blogActions,
  ...decalActions,
  ...epicActions,
  ...flagActions,
  ...imageActions,
  ...leaderboardActions,
  ...ratActions,
  ...rescueActions,
  ...serviceActions,
  ...sessionActions,
  ...shipActions,
  ...stripeActions,
  ...userActions,
  ...verifyActions,
  ...wordpressActions,
}





const ignoredTypes = [
  // This pops up on every 404 page due to how our fallback system works, therefore it's not generally helpful to log.
  actionTypes.wordpress.pages.read,
]

const middlewares = [thunkMiddleware, errorLoggerMiddleware(ignoredTypes)]
if ($IS_DEVELOPMENT) {
  middlewares.unshift(require('redux-immutable-state-invariant').default())
  middlewares.push(FSAComplianceMiddleware)
}





const initStore = (state = initialState) => {
  return createStore(reducer, state, composeWithDevTools(applyMiddleware(...middlewares)))
}





const connectDecorator = (target) => {
  const {
    mapDispatchToProps: mDTP,
    mapStateToProps,
    mergeProps,
    reduxOptions,
  } = target
  let mapDispatchToProps = mDTP

  if (Array.isArray(mDTP)) {
    mapDispatchToProps = (dispatch) => {
      return bindActionCreators(
        mDTP.reduce(
          (acc, actionName) => {
            return {
              ...acc,
              [actionName]: actions[actionName],
            }
          },
          {},
        ),
        dispatch,
      )
    }
  }

  return connect(
    mapStateToProps || (() => {
      return {}
    }),
    mapDispatchToProps || {},
    mergeProps,
    reduxOptions,
  )(target)
}





const getActionCreators = (action, dispatch) => {
  let resolvedAction = action

  if (Array.isArray(action) && typeof action[0] === 'string') {
    resolvedAction = action.reduce((acc, actionName) => {
      return {
        ...acc,
        [actionName]: actions[actionName],
      }
    }, {})
  }

  if (typeof action === 'string') {
    resolvedAction = actions[action]
  }

  return bindActionCreators(resolvedAction, dispatch)
}





export {
  getActionCreators,
  connectDecorator as connect,
  initStore,
}
