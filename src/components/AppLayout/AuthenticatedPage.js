import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'





import HttpStatus from '../../helpers/HttpStatus'
import { pageRedirect, setError } from '../../helpers/gIPTools'
import userHasPermission from '../../helpers/userHasPermission'
import { selectSession, withCurrentUserId, selectGroupsByUserId } from '../../store/selectors'





const authenticated = (scopes) => {
  return (PageComponent) => {
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
        const userGroups = withCurrentUserId(selectGroupsByUserId)(state)

        if (!userHasPermission(userGroups, scopes)) {
          setError(HttpStatus.UNAUTHORIZED)
        }
      }


      return (await PageComponent.getInitialProps?.(ctx)) ?? {}
    }

    return hoistNonReactStatics(AuthenticatedPage, PageComponent, { getInitialProps: true })
  }
}





export default authenticated
