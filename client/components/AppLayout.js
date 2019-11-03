// Module imports
import { StripeProvider } from 'react-stripe-elements'
import getConfig from 'next/config'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'




// Component imports
import { connect } from '../store'
import {
  selectAuthentication,
  selectFlagByName,
  selectUser,
  selectUserGroups,
} from '../store/selectors'
import { Router } from '../routes'
import frApi from '../services/fuelrats'
import ErrorPage from '../pages/_error'
import Header from './Header'
import httpStatus from '../helpers/httpStatus'
import initUserSession from '../helpers/initUserSession'
import LoginModal from './LoginModal'
import NProgress from './NProgress'
import PageLayout from './AppLayout/PageLayout'
import userHasPermission from '../helpers/userHasPermission'
import UserMenu from './UserMenu'




const { publicRuntimeConfig } = getConfig()





// Component Constants
const STRIPE_API_PK = publicRuntimeConfig.apis.stripe.public





@connect
class AppLayout extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleLoginDialogClose = () => this.props.setFlag('showLoginDialog', false)





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

    let statusCode = httpStatus.OK
    const accessToken = await initUserSession(ctx)

    if (!accessToken && Component.ಠ_ಠ_AUTHENTICATION_REQUIRED) {
      if (res) {
        res.writeHead(httpStatus.FOUND, {
          Location: `/?authenticate=true&destination=${encodeURIComponent(asPath)}`,
        })
        res.end()
        res.finished = true
      } else {
        Router.replace(`/?authenticate=true&destination=${encodeURIComponent(asPath)}`)
      }

      return null
    }

    if (Component.ಠ_ಠ_REQUIRED_PERMISSION) {
      const state = store.getState()
      const userGroups = selectUserGroups(state)

      if (!userHasPermission(userGroups, Component.ಠ_ಠ_REQUIRED_PERMISSION)) {
        if (ctx.res) {
          /* eslint-disable-next-line require-atomic-updates */// This is fine
          ctx.res.statusCode = httpStatus.UNAUTHORIZED
        } else {
          statusCode = httpStatus.UNAUTHORIZED
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

    if (statusCode !== httpStatus.OK) {
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

  constructor (props) {
    super(props)

    if (this.props.verifyError) {
      this.props.logout(true)
    } else if (this.props.accessToken) {
      frApi.defaults.headers.common.Authorization = `Bearer ${this.props.accessToken}`
    }
  }

  componentDidUpdate (prevProps) {
    const {
      loggedIn,
      Component,
    } = this.props

    if (!loggedIn && prevProps.loggedIn && Component.ಠ_ಠ_AUTHENTICATION_REQUIRED) {
      Router.push('/')
    }
  }

  render () {
    const {
      renderLayout,
      isServer,
    } = this.props

    return (
      <div role="application">

        <NProgress
          minimum={0.15}
          showSpinner={false} />

        {renderLayout && (
          <>
            <Header isServer={isServer} />
            <UserMenu />
          </>
        )}

        <PageLayout {...this.pageLayoutProps} />

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

    if (statusCode !== httpStatus.OK) {
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
    }
  }


  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getUser', 'logout', 'setFlag', 'updateLoggingInState']

  static mapStateToProps = (state) => ({
    ...selectAuthentication(state),
    showLoginModal: selectFlagByName(state, { name: 'showLoginDialog' }),
    user: selectUser(state),
  })
}





/**
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





/**
 * Decorator to wrap a page with stripe context
 */
const withStripe = (Component) => {
  class StripePage extends React.Component {
    state = {
      stripe: null,
    }

    componentDidMount () {
      if (!this.state.stripe) {
        if (window.Stripe) {
          this.setState({ stripe: window.Stripe(STRIPE_API_PK) })
        } else {
          document.querySelector('#stripe-js').addEventListener('load', () => {
            this.setState({ stripe: window.Stripe(STRIPE_API_PK) })
          })
        }
      }
    }

    render () {
      return (
        <StripeProvider stripe={this.state.stripe}>
          <Component {...this.props} />
        </StripeProvider>
      )
    }
  }

  return hoistNonReactStatics(StripePage, Component)
}





export default AppLayout
export {
  authenticated,
  withStripe,
}
