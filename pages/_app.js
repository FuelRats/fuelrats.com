
// Module imports
import { bindActionCreators } from 'redux'
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import React from 'react'
import withRedux from 'next-redux-wrapper'
import Cookies from 'next-cookies'
import LocalForage from 'localforage'
import getConfig from 'next/config'



// Component imports
import {
  actions,
  initStore,
} from '../store'
import { Router } from '../routes'
import * as faIcons from '../helpers/siteIcons'
import apiService from '../services/api'
import Head from '../components/Head'
import Header from '../components/Header'
import UserMenu from '../components/UserMenu'
import LoginDialog from '../components/LoginDialog'





// Style imports
import '../scss/app.scss'





// Component constants
const { publicRuntimeConfig } = getConfig()
const serverApiUrl = publicRuntimeConfig.apis.fuelRats.server





// Configure and populate FontAweomse library
faConfig.autoAddCss = false
faLibrary.add(faIcons)





class NextApp extends App {
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

  static async getInitialProps (ctx) {
    const {
      Component,
      res,
      asPath,
      isServer,
      query,
      store,
    } = ctx

    let pageProps = {}
    let verified = false

    const {
      access_token: accessToken,
    } = Cookies(ctx)


    if (isServer) {
      apiService.defaults.baseURL = `${serverApiUrl}`
    }

    if (accessToken) {
      apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`
      const getUser = (...args) => actions.getUser(...args)(store.dispatch)
      const logout = (...args) => actions.logout(...args)(store.dispatch)
      verified = await NextApp._getUserData(getUser, logout)
    } else {
      actions.updateLoggingInState()(store.dispatch)
    }

    if (!verified && Component.authenticationRequired) {
      if (res) {
        res.writeHead(302, {
          Location: `/?authenticate=true&destination=${encodeURIComponent(asPath)}`,
        })
        res.end()
        res.finished = true
      } else {
        Router.replace(`/?authenticate=true&destination=${encodeURIComponent(asPath)}`)
      }

      return {}
    }


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


  async componentDidUpdate () {
    const {
      getUser,
      isServer,
      loggedIn,
      logout,
      user,
    } = this.props

    if (loggedIn && !user.attributes) {
      const verified = await NextApp._getUserData(getUser, logout)

      if (!verified && !isServer) {
        Router.push('/')
      }
    }
  }

  constructor(props) {
    super(props)
    LocalForage.config({
      name: 'TheFuelRats',
      storeName: 'webStore',
    })

    if (this.props.verifyError) {
      this.props.logout(true)
    } else if (this.props.accessToken && this.props.loggedIn) {
      apiService.defaults.headers.common.Authorization = `Bearer ${this.props.accessToken}`
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
      setFlag,
    } = this.props

    const mainClasses = ['fade-in', 'page', Component.title.toLowerCase().replace(/\s/g, '-')].join(' ')

    return (
      <Container>
        <Provider store={store}>
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
              <LoginDialog onClose={() => setFlag('showLoginDialog', false)} />
            )}

          </div>
        </Provider>
      </Container>
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(NextApp)
