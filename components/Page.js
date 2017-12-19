// Module imports
import { bindActionCreators } from 'redux'
import LocalForage from 'localforage'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../store'
import Dialog from './Dialog'
import Head from './Head'
import Header from './Header'
import Reminders from './Reminders'
import UserMenu from './UserMenu'





// Initialize the Redux store
initStore()





const dev = preval`module.exports = process.env.NODE_ENV !== 'production'`





export default (Component, title = 'Untitled', reduxOptions = {}) => {
  class Page extends React.Component {
    constructor(props) {
      super(props)

      LocalForage.config({
        storeName: dev ? 'FRWebDev' : 'FRWeb',
      })
    }

    static async getInitialProps(ctx) {
      const {
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
        ...props,
      }
    }

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

          <Reminders />

          <main className={mainClasses}>
            <Component {...this.props} />
          </main>

          <Dialog />
        </div>
      )
    }
  }

  const { mapStateToProps } = reduxOptions
  let { mapDispatchToProps } = reduxOptions

  if (Array.isArray(reduxOptions.mapDispatchToProps)) {
    mapDispatchToProps = dispatch => {
      const actionMap = {}

      for (const actionName of reduxOptions.mapDispatchToProps) {
        actionMap[actionName] = bindActionCreators(actions[actionName], dispatch)
      }

      return actionMap
    }
  }

  return withRedux(initStore, mapStateToProps, mapDispatchToProps)(Page)
}
