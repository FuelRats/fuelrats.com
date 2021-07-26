import { errorLoggerMiddleware } from '@fuelrats/web-util/redux-middleware'
import React, { useCallback } from 'react'
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
 * DO NOT INTRODUCE TO NEW COMPONENTS
 *
 * @param {Function} stateProvider a function which returns an object of state values. hook-compatible
 * @returns {React.FC}
 */
export function connectState (stateProvider) {
  return (Component) => {
    return (comProps) => {
      const stateProps = stateProvider(comProps) ?? {}
      return (
        <Component
          {...comProps}
          {...stateProps} />
      )
    }
  }
}

export function useAction (actionCreator) {
  const dispatch = useDispatch()
  return useCallback((...props) => {
    return dispatch(actionCreator(...props))
  }, [actionCreator, dispatch])
}


export const initStore = (state = initialState) => {
  return createStore(reducer, state, composeWithDevTools(applyMiddleware(...middlewares)))
}
