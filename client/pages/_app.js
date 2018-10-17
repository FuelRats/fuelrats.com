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
import AppLayout from '../components/AppLayout'





// Style imports
import '../scss/app.scss' /* eslint-disable-line import/no-unassigned-import */// import required to initiate css loading





// Configure and populate FontAweomse library
faConfig.autoAddCss = false
faLibrary.add(faIcons)




@withRedux(initStore)
class NextApp extends App {
  constructor (props) {
    super(props)

    LocalForage.config({
      name: 'TheFuelRats',
      storeName: 'webStore',
    })
  }

  static getInitialProps (appProps) {
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





export default NextApp
