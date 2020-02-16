// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import LocalForage from 'localforage'
import withRedux from 'next-redux-wrapper'
import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'



// Component imports
import AppLayout from '../components/AppLayout'
import * as faIcons from '../helpers/faIconLibrary'
import { initStore } from '../store'





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
      <React.StrictMode>
        <Provider store={store}>
          <AppLayout {...layoutProps} />
        </Provider>
      </React.StrictMode>
    )
  }
}





export default FuelRatsApp
