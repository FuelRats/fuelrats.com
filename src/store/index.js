import { errorLoggerMiddleware } from '@fuelrats/web-util/redux-middleware'
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




export const initStore = (state = initialState) => {
  return createStore(reducer, state, composeWithDevTools(applyMiddleware(...middlewares)))
}
