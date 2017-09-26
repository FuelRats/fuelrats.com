// Module imports
import { bindActionCreators } from 'redux'
import { Provider } from 'react-redux'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../store'
import Dialog from './Dialog'
import LoginDialog from './LoginDialog'
import Head from './Head'
import Header from './Header'
import Reminders from './Reminders'
import UserMenu from './UserMenu'





// Component constants
const store = initStore()





export default (Component, title = 'Untitled', reduxOptions = {}) => {
  class Page extends React.Component {
    static async getInitialProps(ctx) {
      let {
        asPath,
        isServer,
        query,
      } = ctx
      let props = {}

      if (typeof Component.getInitialProps === 'function') {
        props = await Component.getInitialProps(ctx)
      }

      return {
        asPath,
        isServer,
        query,
        ...props
      }
    }

    render() {
      let {
        isServer,
        path,
      } = this.props
      let mainClasses = ['fade-in', 'page', title.toLowerCase().replace(/\s/g, '-')].join(' ')

      return (
        <div role="application">
          <Head title={title} />

          <Header
            isServer={isServer}
            path={path} />

          <UserMenu />

          <Reminders />

          <main className={mainClasses}>
            <Component {...this.props} />
          </main>

          <Dialog />
        </div>
      )
    }
  }

  let mapDispatchToProps = reduxOptions.mapDispatchToProps

  if (Array.isArray(reduxOptions.mapDispatchToProps)) {
    mapDispatchToProps = dispatch => {
      let actionMap = {}

      for (let actionName of reduxOptions.mapDispatchToProps) {
        actionMap[actionName] = bindActionCreators(actions[actionName], dispatch)
      }

      return actionMap
    }
  }

  return withRedux(initStore, reduxOptions.mapStateToProps, mapDispatchToProps)(Page)
}
