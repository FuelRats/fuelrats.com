import React from 'react'

import { initStore } from '~/store'

const STORE_KEY = '__NEXT_REDUX_STORE__'

function getOrCreateStore (initialState) {
  if (typeof window === 'undefined') {
    return initStore(initialState)
  }

  if (!window[STORE_KEY]) {
    window[STORE_KEY] = initStore(initialState)
  }

  return window[STORE_KEY]
}

export default function withReduxStore (App) {
  return class WrappedApp extends React.Component {
    static async getInitialProps (appContext) {
      const store = getOrCreateStore()

      // Make store available in page getInitialProps via ctx
      const ctx = { ...appContext.ctx, store }
      const wrappedAppContext = { ...appContext, ctx }

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(wrappedAppContext)
      }

      return {
        ...appProps,
        initialReduxState: store.getState(),
      }
    }

    constructor (props) {
      super(props)
      this.store = getOrCreateStore(props.initialReduxState)
    }

    render () {
      const { initialReduxState, ...props } = this.props
      return <App {...props} store={this.store} />
    }
  }
}
