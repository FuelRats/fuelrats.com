import { errorLoggerMiddleware } from '@fuelrats/web-util/redux-middleware'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'
import { useDispatch } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import frSocket from '~/services/frSocket'

import actionTypes from './actionTypes'
import initialState from './initialState'
import reducer from './reducers'

const ignoredTypes = [
  // This pops up on every 404 page due to how our fallback system works, therefore it's not generally helpful to log.
  actionTypes.wordpress.pages.read,
]

const middlewares = [thunkMiddleware, frSocket.createMiddleware(), errorLoggerMiddleware(ignoredTypes)]
if ($$BUILD.isDev) {
  middlewares.unshift(require('redux-immutable-state-invariant').default())
  middlewares.push(require('@fuelrats/web-util/redux-middleware').FSAComplianceMiddleware)
}



/**
 * Transitionary method of connecting state to hard-to-refactor class components.
 *
 * Provides state returned by the provider function and automatically attaches the dispatch() function.
 *
 * DO NOT INTRODUCE TO NEW COMPONENTS
 *
 * @param {Function} stateProvider a function which returns an object of state values. hook-compatible. props and dispatch are available through arguments.
 * @returns {React.FC}
 */
export function connectState (stateProvider) {
  return (Component) => {
    return hoistNonReactStatics((props) => {
      const dispatch = useDispatch()
      const stateProps = stateProvider?.(props, dispatch) ?? {}
      return (
        <Component
          {...props}
          {...stateProps}
          dispatch={dispatch} />
      )
    }, Component)
  }
}

export const initStore = (state = initialState) => {
  return createStore(reducer, state, composeWithDevTools(applyMiddleware(...middlewares)))
}
