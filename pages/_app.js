
// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import React from 'react'
import withRedux from 'next-redux-wrapper'
import LocalForage from 'localforage'



// Component imports
import { initStore } from '../store'
import * as faIcons from '../helpers/faIconLibrary'
import AppLayout from './_app-layout'





// Style imports
import '../scss/app.scss'





// Configure and populate FontAweomse library
faConfig.autoAddCss = false
faLibrary.add(faIcons)





class NextApp extends App {
  constructor (props) {
    super(props)

    LocalForage.config({
      name: 'TheFuelRats',
      storeName: 'webStore',
    })
  }

  static async getInitialProps (appProps) {
    return AppLayout.getInitialProps(appProps)
  }

  render () {
    const {
      store,
    } = this.props

    return (
      <Container>
        <Provider store={store}>
          <AppLayout {...this.props} />
        </Provider>
      </Container>
    )
  }
}

export default withRedux(initStore)(NextApp)
