import { HttpStatus } from '@fuelrats/web-util/http'
import hoistNonReactStatics from 'hoist-non-react-statics'

import { selectSession, selectCurrentUserHasScope } from '~/store/selectors'
import pageRedirect from '~/util/getInitialProps/pageRedirect'
import setError from '~/util/getInitialProps/setError'





const wrapPage = (scope, message, PageComponent) => {
  function AuthenticatedPage (props) {
    return (<PageComponent {...props} />)
  }

  AuthenticatedPage.displayName = `AuthenticatedPage(${PageComponent.displayName || PageComponent.name || 'PageComponent'})`
  AuthenticatedPage.requiresAuthentication = true

  AuthenticatedPage.getInitialProps = async (ctx) => {
    // Get state so we can check up on the session info.
    const state = ctx.store.getState()
    const { loggedIn } = selectSession(state)

    // If the user isn't logged in, redirect to login since we know they can't view an authenticated route.
    if (!loggedIn) {
      pageRedirect(ctx, `/?authenticate=true&destination=${encodeURIComponent(ctx.asPath)}`)
      return {}
    }

    // Now that we know the user is logged in, lets check if they require any permission scopes to view the page.
    // If they do, check scopes against their groups.
    if (scope) {
      if (!selectCurrentUserHasScope(state, { scope })) {
        setError(ctx, HttpStatus.UNAUTHORIZED, message)
      }
    }


    return (await PageComponent.getInitialProps?.(ctx)) ?? {}
  }

  return hoistNonReactStatics(AuthenticatedPage, PageComponent, { getInitialProps: true })
}


const authenticated = (scope, message) => {
  if (typeof scope === 'string' || Array.isArray(scope)) {
    return wrapPage.bind(null, scope, message)
  }

  // opt is not a scope so we know it's the page component we're wrapping.
  return wrapPage(undefined, undefined, scope)
}





export default authenticated
