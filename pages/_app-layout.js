
// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'
import Cookies from 'next-cookies'
import getConfig from 'next/config'



// Component imports
import { actions } from '../store'
import { Router } from '../routes'
import apiService from '../services/api'
import Head from '../components/Head'
import Header from '../components/Header'
import UserMenu from '../components/UserMenu'
import LoginDialog from '../components/LoginDialog'





// Component constants
const { publicRuntimeConfig } = getConfig()
const serverApiUrl = publicRuntimeConfig.apis.fuelRats.server





class AppLayout extends React.Component {
  static async _getUserData (getUser, logout) {
    const { payload, status } = await getUser()

    if (status !== 'success' && payload && Array.isArray(payload.errors)) {
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
      isServer,
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

    if (isServer) {
      apiService.defaults.baseURL = `${serverApiUrl}`
    }

    if (accessToken) {
      apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`

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

    if (!accessToken && Component.authenticationRequired) {
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
      pageProps: {
        asPath,
        isServer,
        query,
        accessToken,
        ...pageProps,
      },
    }
  }

  constructor(props) {
    super(props)

    if (this.props.verifyError) {
      this.props.logout(true)
    } else if (this.props.accessToken && this.props.loggedIn) {
      apiService.defaults.headers.common.Authorization = `Bearer ${this.props.accessToken}`
    }
  }

  componentDidUpdate(prevProps) {
    const {
      loggedIn,
      Component,
    } = this.props

    if (!loggedIn && prevProps.loggedIn && Component.authenticationRequired) {
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

    const mainClasses = ['fade-in', 'page', Component.title.toLowerCase().replace(/\s/g, '-')].join(' ')
    return (
      <div role="application">
        <Head title={Component.title} />

        <Header
          isServer={isServer}
          path={path} />

        <UserMenu />

        <main className={mainClasses}>
          <Component {...pageProps} />
        </main>

        {showLoginDialog && (
          <LoginDialog onClose={() => actions.setFlag('showLoginDialog', false)(store.dispatch)} />
        )}

      </div>
    )
  }
}


const mapStateToProps = ({ authentication, flags, user }) => ({
  loggedIn: authentication.loggedIn,
  showLoginDialog: flags.showLoginDialog,
  verifyError: authentication.verifyError,
  user,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getUser: actions.getUser,
  logout: actions.logout,
  setFlag: actions.setFlag,
  updateLoggingInState: actions.updateLoggingInState,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout)
