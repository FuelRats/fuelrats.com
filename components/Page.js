// Module imports
import { bindActionCreators } from 'redux'
import Cookies from 'next-cookies'
import LocalForage from 'localforage'
import React from 'react'
import withRedux from 'next-redux-wrapper'
import { library } from '@fortawesome/fontawesome-svg-core'




// Component imports
import {
  actions,
  initStore,
} from '../store'
import { Router } from '../routes'
import * as faIcons from '../helpers/siteIcons'
import Head from './Head'
import Header from './Header'
import UserMenu from './UserMenu'
import LoginDialog from './LoginDialog'





// Populate fontAweomse library
library.add(...Object.values(faIcons))





// Initialize the Redux store
initStore()





export default (Component, title = 'Untitled', reduxOptions = {}, authenticationRequired = false) => {
  class Page extends React.Component {
    constructor(props) {
      super(props)
      LocalForage.config({
        name: 'TheFuelRats',
        storeName: 'webStore',
      })
    }

    /* eslint-disable camelcase */
    static async getInitialProps(ctx) {
      const {
        res,
        asPath,
        isServer,
        query,
      } = ctx

      let props = {}

      const {
        access_token,
        user_id,
      } = Cookies(ctx)

      if (authenticationRequired && !access_token) {
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
        userId: user_id,
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
              {...this.props} />
          </main>

          {__showLoginDialog && (
            <LoginDialog onClose={() => setFlag('showLoginDialog', false)} />
          )}
        </div>
      )
    }
  }

  const mapStateToProps = (state, ownProps) => {
    let pageProps = {}

    if (reduxOptions && reduxOptions.mapStateToProps) {
      pageProps = reduxOptions.mapStateToProps(state, ownProps)
    }

    return {
      ...pageProps,
      __showLoginDialog: state.flags.showLoginDialog,
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
    }, dispatch)
  }

  return withRedux(initStore, mapStateToProps, mapDispatchToProps)(Page)
}
