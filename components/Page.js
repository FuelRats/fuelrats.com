// Module imports
import { bindActionCreators } from 'redux'
import Cookies from 'next-cookies'
import LocalForage from 'localforage'
import React from 'react'
import withRedux from 'next-redux-wrapper'
import fontawesome from '@fortawesome/fontawesome'
import {
  faBars,
  faCheck,
  faClock,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFolder,
  faInfoCircle,
  faSpinner,
  faTimes,
  faUser,
} from '@fortawesome/fontawesome-free-solid'




// Component imports
import {
  actions,
  initStore,
} from '../store'
import { Router } from '../routes'
import Head from './Head'
import Header from './Header'
import UserMenu from './UserMenu'





// Initialize the Redux store
initStore()





export default (Component, title = 'Untitled', reduxOptions = {}, authenticationRequired = false) => {
  class Page extends React.Component {
    constructor(props) {
      super(props)

      fontawesome.library.add(
        faBars,
        faCheck,
        faClock,
        faExclamationTriangle,
        faEye,
        faEyeSlash,
        faFolder,
        faInfoCircle,
        faSpinner,
        faTimes,
        faUser,
      )

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
        isServer,
        path,
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
            <Component {...this.props} />
          </main>
        </div>
      )
    }
  }

  const { mapStateToProps } = reduxOptions || {}
  let { mapDispatchToProps } = reduxOptions || {}

  if (Array.isArray(mapDispatchToProps)) {
    mapDispatchToProps = dispatch => {
      const actionMap = {}

      for (const actionName of (reduxOptions || {}).mapDispatchToProps) {
        actionMap[actionName] = bindActionCreators(actions[actionName], dispatch)
      }

      return actionMap
    }
  }

  return withRedux(initStore, mapStateToProps, mapDispatchToProps)(Page)
}
