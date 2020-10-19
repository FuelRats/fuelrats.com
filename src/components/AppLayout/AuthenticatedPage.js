import { HttpStatus } from '@fuelrats/web-util/http'
import hoistNonReactStatics from 'hoist-non-react-statics'





import { pageRedirect, setError } from '~/helpers/gIPTools'
import userHasPermission from '~/helpers/userHasPermission'
import { selectSession, selectCurrentUserScopes } from '~/store/selectors'



const wrapPage = (PageComponent, scopes) => {
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
    if (scopes) {
      if (!userHasPermission(selectCurrentUserScopes(state), scopes)) {
        setError(ctx, HttpStatus.UNAUTHORIZED)
      }
    }


    return (await PageComponent.getInitialProps?.(ctx)) ?? {}
  }

  return hoistNonReactStatics(AuthenticatedPage, PageComponent, { getInitialProps: true })
}


const authenticated = (opt) => {
  // Check if `opt` is a permission scope or lsit of scopes.
  // If it is then we need to return a function to get the component before passing to wrapPage
  if (typeof opt === 'string' || Array.isArray(opt)) {
    return (PageComponent) => {
      return wrapPage(PageComponent, opt)
    }
  }

  // opt is not a scope so we know it's the page component we're wrapping.
  return wrapPage(opt)
}





export default authenticated
