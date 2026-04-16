import { errorLoggerMiddleware } from '@fuelrats/web-util/redux-middleware'
import { configureStore } from '@reduxjs/toolkit'

import frSocket from '~/services/frSocket'

import actionTypes from './actionTypes'
import initialState from './initialState'
import reducer from './reducers'

const ignoredTypes = [
  // This pops up on every 404 page due to how our fallback system works, therefore it's not generally helpful to log.
  actionTypes.wordpress.pages.read,
]


export const initStore = (state = initialState) => {
  const middlewares = [frSocket.createMiddleware(), errorLoggerMiddleware(ignoredTypes)]
  if ($$BUILD.isDev) {
    middlewares.unshift(require('redux-immutable-state-invariant').default())
    middlewares.push(require('@fuelrats/web-util/redux-middleware').FSAComplianceMiddleware)
  }

  return configureStore({
    reducer,
    preloadedState: state,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(middlewares)
    },
  })
}
