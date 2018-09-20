
// Module imports
import { bindActionCreators } from 'redux'
import {
  StripeProvider,
} from 'react-stripe-elements'
import getConfig from 'next/config'
import hoistNonReactStatics from 'hoist-non-react-statics'
import NextHead from 'next/head'
import NProgress from 'nprogress'
import React from 'react'

// Component imports
import { actions, connect } from '../store'
import { Router } from '../routes'
import apiService from '../services/api'
import Header from './Header'
import UserMenu from './UserMenu'
import LoginDialog from './LoginDialog'
import initUserSession from '../helpers/initUserSession'




NProgress.configure({ showSpinner: false })
Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeError = () => NProgress.done()
Router.onRouteChangeComplete = () => NProgress.done()

const { publicRuntimeConfig } = getConfig()
const STRIPE_API_PK = publicRuntimeConfig.apis.stripe.public



@connect
class AppLayout extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ Component, ctx }) {
    const {
      res,
      asPath,
      isServer,
      query,
    } = ctx

    const accessToken = await initUserSession(ctx)

    if (!accessToken && Component.ಠ_ಠ_AUTHENTICATION_REQUIRED) {
      if (res) {
        res.writeHead(302, {
          Location: `/?authenticate=true&destination=${encodeURIComponent(asPath)}`,
        })
        res.end()
        res.finished = true
      } else {
        Router.replace(`/?authenticate=true&destination=${encodeURIComponent(asPath)}`)
      }

      return null
    }

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {
      accessToken,
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
      apiService().defaults.headers.common.Authorization = `Bearer ${this.props.accessToken}`
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
      Component,
      isServer,
      pageProps,
      showLoginDialog,
      store,
      path,
    } = this.props

    return (
      <div role="application">
        <NextHead>
          <title>{Component.title} | Fuelrats.com</title>
          <link rel="stylesheet" href="/_next/static/style.css" />
        </NextHead>

        <Header
          isServer={isServer}
          path={path} />

        <UserMenu />


        <Component {...pageProps} />


        {showLoginDialog && (
          <LoginDialog onClose={() => actions.setFlag('showLoginDialog', false)(store.dispatch)} />
        )}

      </div>
    )
  }

  static mapStateToProps = ({ authentication, flags, user }) => ({
    loggedIn: authentication.loggedIn,
    showLoginDialog: flags.showLoginDialog,
    verifyError: authentication.verifyError,
    user,
  })

  static mapDispatchToProps = dispatch => bindActionCreators({
    getUser: actions.getUser,
    logout: actions.logout,
    setFlag: actions.setFlag,
    updateLoggingInState: actions.updateLoggingInState,
  }, dispatch)
}




export default AppLayout





/**
 * Decorator to mark a page as requiring user authentication.
 */
export function authenticated (target) {
  target.ಠ_ಠ_AUTHENTICATION_REQUIRED = true
}

/**
 * Decorator to wrap a page with stripe context
 */
export function withStripe (Component) {
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
