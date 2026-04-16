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
  function WrappedApp (props) {
    const { initialReduxState, ...passthrough } = props
    const store = getOrCreateStore(initialReduxState)
    return <App {...passthrough} store={store} />
  }

  WrappedApp.displayName = `withReduxStore(${App.displayName ?? App.name ?? 'App'})`

  WrappedApp.getInitialProps = async (appContext) => {
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

  return WrappedApp
}
