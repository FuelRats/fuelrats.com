// Module imports
import { StripeProvider } from 'react-stripe-elements'
import getConfig from 'next/config'
import hoistNonReactStatics from 'hoist-non-react-statics'
import NextError from 'next/error'
import NProgress from 'nprogress'
import React from 'react'





// Component imports
import { connect } from '../store'
import { Router } from '../routes'
import apiService from '../services/api'
import Header from './Header'
import UserMenu from './UserMenu'
import LoginDialog from './LoginDialog'
import initUserSession from '../helpers/initUserSession'
import userHasPermission from '../helpers/userHasPermission'
import httpStatus from '../helpers/httpStatus'




NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', () => NProgress.done())

const { publicRuntimeConfig } = getConfig()


// Component Constants
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
      const {
        groups,
        user,
      } = store.getState()

      let userGroups = []

      if (user.relationships.groups.data) {
        userGroups = user.relationships.groups.data.reduce((acc, group) => [
          ...acc,
          groups[group.id],
        ], [])
      }

      if (!userHasPermission(userGroups, Component.ಠ_ಠ_REQUIRED_PERMISSION)) {
        if (ctx.res) {
          ctx.res.statusCode = 401
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

    return {
      ...layoutProps,
      accessToken,
      statusCode,
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
      renderLayout,
      showLoginDialog,
      statusCode,
      setFlag,
      path,
    } = this.props

    return (
      <div role="application">

        {renderLayout && (
         <>
           <Header
             isServer={isServer}
             path={path} />

           <UserMenu />
         </>
        )}

        {statusCode === httpStatus.OK
          ? <Component {...pageProps} />
          : (
            <main className="fade-in page error-page">
              <div className="page-content">
                <NextError className="test" statusCode={statusCode} />
              </div>
            </main>
          )
        }

        {showLoginDialog && (
          <LoginDialog onClose={() => setFlag('showLoginDialog', false)} />
        )}

      </div>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getUser', 'logout', 'setFlag', 'updateLoggingInState']

  static mapStateToProps = ({ authentication, flags, user }) => ({
    loggedIn: authentication.loggedIn,
    showLoginDialog: flags.showLoginDialog,
    verifyError: authentication.verifyError,
    user,
  })
}




export default AppLayout





/**
 * Decorator to mark a page as requiring user authentication.
 */
export const authenticated = (_target) => {
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
export const withStripe = (Component) => {
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
