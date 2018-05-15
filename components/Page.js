// Module imports
import { bindActionCreators } from 'redux'
import { library as faLibrary } from '@fortawesome/fontawesome-svg-core'
import Cookies from 'next-cookies'
import LocalForage from 'localforage'
import React from 'react'
import withRedux from 'next-redux-wrapper'
import getConfig from 'next/config'



// Component imports
import {
  actions,
  initStore,
} from '../store'
import { Router } from '../routes'
import * as faIcons from '../helpers/siteIcons'
import apiService from '../services/api'
import Head from './Head'
import Header from './Header'
import UserMenu from './UserMenu'
import LoginDialog from './LoginDialog'



// Component constants
const { publicRuntimeConfig } = getConfig()
const serverApiUrl = publicRuntimeConfig.apis.fuelRats.server





// Populate fontAweomse library
faLibrary.add(faIcons)





// Initialize the Redux store
initStore()





export default (Component, title = 'Untitled', reduxOptions = {}, authenticationRequired = false) => {
  class Page extends React.Component {
    static async _verifyAuthenticatedUser (props) {
      const {
        loggedIn,
        logout,
        verifyError,
        getUser,
      } = props

      if (verifyError) {
        return false
      }

      if (loggedIn) {
        return true
      }

      const { payload, status } = await getUser()

      // If the API returned in error, double check the reasoning.
      if (status !== 'success') {
        if (payload && Array.isArray(payload.errors)) {
          const errMsg = payload.errors[0] && payload.errors[0].status

          if (errMsg === 'Unauthorized') {
            await logout(true)
            return false
          }
        }

        // Something else went wrong, but we cannot determine if the session is invalid
      }

      return true
    }

    constructor(props) {
      super(props)
      LocalForage.config({
        name: 'TheFuelRats',
        storeName: 'webStore',
      })

      if (this.props.__verifyError) {
        this.props.logout(true)
      } else if (this.props.accessToken && this.props.__loggedIn) {
        apiService.defaults.headers.common.Authorization = `Bearer ${this.props.accessToken}`
      }
    }

    /* eslint-disable camelcase */
    static async getInitialProps(ctx) {
      const {
        res,
        asPath,
        isServer,
        query,
        store,
      } = ctx

      let props = {}

      const {
        access_token: accessToken,
      } = Cookies(ctx)

      let verified = false

      if (isServer) {
        apiService.defaults.baseURL = `${serverApiUrl}`
      }

      if (accessToken) {
        apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        verified = await Page._verifyAuthenticatedUser({
          ...store.getState().authentication,
          logout: (...args) => actions.logout(...args)(store.dispatch),
          getUser: (...args) => actions.getUser(...args)(store.dispatch),
        })
      } else {
        actions.updateLoggingInState()(store.dispatch)
      }

      if (!verified && authenticationRequired) {
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

      if (typeof Component.getInitialProps === 'function') {
        props = await Component.getInitialProps(ctx)
      }

      return {
        asPath,
        isServer,
        query,
        accessToken,
        ...props,
      }
    }
    /* eslint-enable camelcase */

    render() {
      const {
        __showLoginDialog,
        isServer,
        path,
        setFlag,
      } = this.props

      const mainClasses = ['fade-in', 'page', title.toLowerCase().replace(/\s/g, '-')].join(' ')

      return (
        <div role="application">
          <Head title={title} />

          <Header
            isServer={isServer}
            path={path} />

          <UserMenu />

          <main className={mainClasses}>
            <Component
              {...this.pageProps} />
          </main>

          {__showLoginDialog && (
            <LoginDialog onClose={() => setFlag('showLoginDialog', false)} />
          )}
        </div>
      )
    }

    get pageProps () {
      const pageProps = { ...this.props }

      delete pageProps.__getUser
      delete pageProps.__loggedIn
      delete pageProps.__logout
      delete pageProps.__showLoginDialog
      delete pageProps.__updateLoggingInState
      delete pageProps.__verifyError

      return pageProps
    }
  }

  const mapStateToProps = (state, ownProps) => {
    let pageProps = {}

    if (reduxOptions && reduxOptions.mapStateToProps) {
      pageProps = reduxOptions.mapStateToProps(state, ownProps)
    }

    return {
      ...pageProps,
      __loggedIn: state.authentication.loggedIn,
      __showLoginDialog: state.flags.showLoginDialog,
      __verifyError: state.authentication.verifyError,
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    let pageActions = {}

    if (reduxOptions && reduxOptions.mapDispatchToProps) {
      pageActions = reduxOptions.mapDispatchToProps

      if (Array.isArray(pageActions)) {
        pageActions = pageActions.reduce((accumulator, actionName) => ({
          ...accumulator,
          [actionName]: actions[actionName],
        }), {})
      } else if (typeof pageActions === 'function') {
        pageActions = pageActions(dispatch, ownProps)
      }
    }

    return bindActionCreators({
      ...pageActions,
      setFlag: actions.setFlag,
      __getUser: actions.getUser,
      __logout: actions.logout,
      __updateLoggingInState: actions.updateLoggingInState,
    }, dispatch)
  }

  return withRedux(initStore, mapStateToProps, mapDispatchToProps)(Page)
}
