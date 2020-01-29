/* globals $IS_DEVELOPMENT:false */
// Module imports
import { connect } from 'react-redux'
import {
  bindActionCreators,
  createStore,
  applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'





// Component imports
import actionStatus from './actionStatus'
import * as actions from './actions'
import initialState from './initialState'
import reducer from './reducers'





const middlewares = [thunkMiddleware]

if ($IS_DEVELOPMENT) {
  /* eslint-disable-next-line global-require */// Dev mode conditional import
  middlewares.unshift(require('redux-immutable-state-invariant').default())
}





const initStore = (state = initialState) => createStore(reducer, state, composeWithDevTools(applyMiddleware(...middlewares)))





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
      dispatch,
    )
  }

  return connect(
    mapStateToProps || (() => ({})),
    mapDispatchToProps || {},
    mergeProps,
    reduxOptions,
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
