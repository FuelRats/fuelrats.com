
// Module imports
import { bindActionCreators } from 'redux'
import React from 'react'
import Cookies from 'next-cookies'



// Component imports
import { actions, connect } from '../store'
import { Router } from '../routes'
import apiService from '../services/api'
import Head from './Head'
import Header from './Header'
import UserMenu from './UserMenu'
import LoginDialog from './LoginDialog'




@connect
class AppLayout extends React.Component {
  static async _getUserData (getUser, logout) {
    const { payload, status } = await getUser()
    if (status === 'error' && payload && Array.isArray(payload.errors)) {
      const errMsg = payload.errors[0] && payload.errors[0].status
      if (errMsg === 'Unauthorized') {
        logout(true)
        return false
      }
    }

    return true
  }

  static async _initUserSessionData (ctx) {
    const {
      store,
    } = ctx

    const {
      authentication: {
        loggedIn,
        verifyError,
      },
      user: {
        attributes: userAttributes,
      },
    } = store.getState()

    const getUser = (...args) => actions.getUser(...args)(store.dispatch)
    const logout = (...args) => actions.logout(...args)(store.dispatch)

    const {
      access_token: accessToken,
    } = Cookies(ctx)

    let verified = loggedIn && userAttributes && !verifyError

    if (accessToken) {
      apiService().defaults.headers.common.Authorization = `Bearer ${accessToken}`

      if (!verified) {
        verified = await AppLayout._getUserData(getUser, logout)
      }
    } else {
      actions.updateLoggingInState()(store.dispatch)
    }

    if (!verified) {
      return null
    }
    return accessToken
  }

  static async getInitialProps ({ Component, ctx }) {
    const {
      res,
      asPath,
      isServer,
      query,
    } = ctx

    const accessToken = await AppLayout._initUserSessionData(ctx)

    if (!accessToken && Component.authRequired) {
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

    if (!loggedIn && prevProps.loggedIn && Component.authRequired) {
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
        <Head title={Component.title} />

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
  target.authRequired = true
}
