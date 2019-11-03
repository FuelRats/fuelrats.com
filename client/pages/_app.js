// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { Provider } from 'react-redux'
import App from 'next/app'
import React from 'react'
import withRedux from 'next-redux-wrapper'
import LocalForage from 'localforage'



// Component imports
import { initStore } from '../store'
import * as faIcons from '../helpers/faIconLibrary'
import AppLayout from '../components/AppLayout'





// Style imports
import '../scss/app.scss'





// Configure and populate FontAweomse library
faConfig.autoAddCss = false
faLibrary.add(faIcons)




@withRedux(initStore)
class FuelRatsApp extends App {
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
      ...layoutProps
    } = this.props

    return (
      <Provider store={store}>
        <AppLayout {...layoutProps} />
      </Provider>
    )
  }
}





export default FuelRatsApp
