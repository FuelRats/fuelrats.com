// Module imports
import React from 'react'





// Component imports
import HttpStatus from '../../helpers/HttpStatus'
import ErrorPage from '../../pages/_error'
import { Router } from '../../routes'
import frApi from '../../services/fuelrats'
import { connect, getActionCreators } from '../../store'
import {
  selectFlagByName,
  selectSession,
  selectUserById,
  selectUserByIdHasScope,
  withCurrentUserId,
} from '../../store/selectors'
import Header from '../Header'
import LoginModal from '../LoginModal'
import NProgress from '../NProgress'
import UserMenu from '../UserMenu'
import PageTransitionContainer from './PageTransitionContainer'





@connect
class AppLayout extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleLoginDialogClose = () => {
    return this.props.setFlag('showLoginDialog', false)
  }

  _handlePageChange = () => {
    this.props.notifyPageChange(this.props.pageProps.asPath)
  }



  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ Component, ctx }) {
    const {
      res,
      asPath,
      isServer,
      query,
      store,
    } = ctx

    let statusCode = (res && res.statusCode) || HttpStatus.OK

    const { initUserSession } = getActionCreators(['initUserSession'], store.dispatch)
    const { error, accessToken } = await initUserSession(ctx)

    if ((error || !accessToken) && Component.ಠ_ಠ_AUTHENTICATION_REQUIRED) {
      if (res) {
        res.writeHead(HttpStatus.FOUND, {
          Location: `/?authenticate=true&destination=${encodeURIComponent(asPath)}`,
        })
        res.end()
        res.finished = true
      } else {
        Router.replace(`/?authenticate=true&destination=${encodeURIComponent(asPath)}`)
      }
    }

    if (!error && accessToken && Component.ಠ_ಠ_REQUIRED_PERMISSION) {
      const state = store.getState()
      const userHasScope = withCurrentUserId(selectUserByIdHasScope)(state, { scope: Component.ಠ_ಠ_REQUIRED_PERMISSION })

      if (!userHasScope) {
        if (ctx.res) {
          /* eslint-disable-next-line require-atomic-updates */// This is fine
          ctx.res.statusCode = HttpStatus.UNAUTHORIZED
        } else {
          statusCode = HttpStatus.UNAUTHORIZED
        }
      }
    }

    let pageProps = {}

    let layoutProps = {
      renderLayout: true,
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...ctx,
        ...(Component.ಠ_ಠ_AUTHENTICATION_REQUIRED ? { accessToken } : {}),
      }, (state) => {
        layoutProps = {
          ...layoutProps,
          ...state,
        }
      })
    }

    if (ctx.res) {
      ({ statusCode } = ctx.res)
    }

    if (statusCode !== HttpStatus.OK) {
      pageProps = await ErrorPage.getInitialProps(ctx)
    }

    let userAgent = ''
    if (ctx.req && ctx.req.headers['user-agent']) {
      userAgent = ctx.req.headers['user-agent'].toLowerCase()
    } else if (typeof window !== 'undefined') {
      userAgent = window.navigator.userAgent.toLowerCase()
    }

    return {
      ...layoutProps,
      accessToken,
      authenticatedPage: Component.ಠ_ಠ_AUTHENTICATION_REQUIRED,
      statusCode,
      userAgent,
      pageProps: {
        asPath,
        isServer,
        query,
        ...pageProps,
      },
    }
  }

  constructor (props, ...rest) {
    super(props, ...rest)

    if (props.accessToken) {
      frApi.defaults.headers.common.Authorization = `Bearer ${props.accessToken}`
    }
  }

  render () {
    const {
      authenticatedPage,
      renderLayout,
      isServer,
    } = this.props

    return (
      <div role="application">

        <NProgress
          minimum={0.15}
          showSpinner={false} />

        {
          renderLayout && (
            <>
              <Header isServer={isServer} />
              <UserMenu authenticatedPage={authenticatedPage} />
            </>
          )
        }

        <PageTransitionContainer {...this.pageLayoutProps} />

        <LoginModal {...this.loginModalProps} />
      </div>
    )
  }

  /***************************************************************************\
    Getters
  \***************************************************************************/

  get loginModalProps () {
    return {
      isOpen: this.props.showLoginModal,
      userAgent: this.props.userAgent,
      onClose: this._handleLoginDialogClose,
    }
  }

  get pageLayoutProps () {
    const {
      Component,
      loggedIn,
      pageProps,
      router,
      statusCode,
    } = this.props

    let pageItem = {
      Page: Component,
      pageProps,
      shouldRender: !Component.ಠ_ಠ_AUTHENTICATION_REQUIRED || loggedIn,
    }

    let pageKey = router.asPath

    if (statusCode !== HttpStatus.OK) {
      pageItem = {
        Page: ErrorPage,
        pageProps,
        shouldRender: true,
      }
      pageKey = 'error'
    }

    return {
      items: pageItem,
      keys: pageKey,
      onDestroyed: this._handlePageChange,
    }
  }


  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['setFlag', 'notifyPageChange']

  static mapStateToProps = (state) => {
    return {
      ...selectSession(state),
      showLoginModal: selectFlagByName(state, { name: 'showLoginDialog' }),
      user: withCurrentUserId(selectUserById)(state),
    }
  }
}





/*
 * Decorator to mark a page as requiring user authentication.
 */
const authenticated = (_target) => {
  const requiredPermission = typeof _target === 'string' ? _target : null

  const setProperties = (target) => {
    target.ಠ_ಠ_AUTHENTICATION_REQUIRED = true

    if (requiredPermission) {
      target.ಠ_ಠ_REQUIRED_PERMISSION = requiredPermission
    }

    return target
  }

  if (requiredPermission) {
    return setProperties
  }

  return setProperties(_target)
}





export default AppLayout
export {
  authenticated,
}
