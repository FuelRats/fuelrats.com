import HttpStatus from '../../helpers/HttpStatus'
import pageRedirect from '../../helpers/pageRedirect'
import userHasPermission from '../../helpers/userHasPermission'
import { selectSession, withCurrentUserId, selectGroupsByUserId } from '../../store/selectors'
import getWrappedPage from './PageWrapper'





const asAuthenticatedPage = (pageConfig, _requiredPerms) => {
  return (PageComponent) => {
    const WrappedPage = getWrappedPage(pageConfig, PageComponent, { getInitialProps: true })

    WrappedPage.displayName = `AuthenticatedPage(${PageComponent.displayName || PageComponent.name || 'PageComponent'})`
    WrappedPage.requiresAuthentication = {}

    WrappedPage.getInitialProps = async (ctx) => {
      // Get the initial props for our page
      const initialProps = {
        pageProps: (await PageComponent.getInitialProps?.(ctx)) ?? {},
      }

      // Now that we've initilized our page, lets get state so we can check up on the session info.
      const state = ctx.store.getState()
      const { loggedIn } = selectSession(state)

      // If the user isn't logged in, redirect to login since we know they can't view an authenticated route.
      if (!loggedIn) {
        pageRedirect(ctx, `/?authenticate=true&destination=${encodeURIComponent(ctx.asPath)}`)
        return {}
      }

      // Now that we know the user is logged in, lets check if they require any permission scopes to view the page.
      // If they do, check against their groups.
      const requiredPerms = typeof _requiredPerms === 'function' ? _requiredPerms({ ...ctx, ...initialProps }) : _requiredPerms
      const userGroups = withCurrentUserId(selectGroupsByUserId)(state)

      if (requiredPerms && !userHasPermission(userGroups, requiredPerms)) {
        if (ctx.res) {
          ctx.res.statusCode = HttpStatus.UNAUTHORIZED
        } else {
          initialProps.err = { statusCode: HttpStatus.UNAUTHORIZED }
        }
      }


      return initialProps
    }

    return WrappedPage
  }
}





export default asAuthenticatedPage
