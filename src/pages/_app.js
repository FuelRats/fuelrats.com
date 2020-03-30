// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import LocalForage from 'localforage'
import withRedux from 'next-redux-wrapper'
import App from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'



// Component imports
import HttpStatus from '../../helpers/HttpStatus'
import ErrorPage from '../../pages/_error'
import frApi from '../../services/fuelrats'
import { connect } from '../../store'
import AppLayout from '../components/AppLayout'





// Style imports
import '../scss/app.scss'
import PageTransitionContainer from '../components/AppLayout/PageTransitionContainer'
import Header from '../components/Header'
import LoginModal from '../components/LoginModal'
import NProgress from '../components/NProgress'
import UserMenu from '../components/UserMenu'
import * as faIcons from '../helpers/faIconLibrary'
import { initStore, actionStatus } from '../store'


import { initUserSession } from '../../store/actions'
import {
  selectSession,
  selectUserById,
  withCurrentUserId,
} from '../../store/selectors'


// Configure and populate FontAweomse library
faConfig.autoAddCss = false
faLibrary.add(faIcons)




@withRedux(initStore)
class FuelRatsApp extends App {
  constructor (props) {
    super(props)

    if (props.accessToken) {
      frApi.defaults.headers.common.Authorization = `Bearer ${props.accessToken}`
    }

    LocalForage.config({
      name: 'TheFuelRats',
      storeName: 'webStore',
    })
  }


  static async getInitialProps ({ Component, ctx }) {
    const {
      asPath,
      isServer,
      query,
      store,
    } = ctx

    const { accessToken } = await initUserSession(ctx)(store.dispatch)

    const initialProps = {
      accessToken,
      pageProps: {
        asPath,
        isServer,
        query,
      },
      ...((await Component.getInitialProps?.(ctx)) ?? {}),
    }

    if (initialProps.err) {
      initialProps.pageProps = {
        ...((await ErrorPage?.getInitialProps(ctx)) ?? {}),
      }
    }

    return initialProps
  }

  render () {
    const {
      Component,
      store,
      pageProps,
      router,
    } = this.props

    return (
      <React.StrictMode>
        <div role="application">
          <Provider store={store}>
            <NProgress />

            <Header />

            <UserMenu authenticatedPage={Component.requiresAuthentication} />

            <PageTransitionContainer
              {...this.pageLayoutProps}
              items={{ Page: Component, pageProps }}
              keys={router.asPath} />

            <LoginModal />
          </Provider>
        </div>
      </React.StrictMode>
    )
  }

  get pageLayoutProps () {
    const {
      Component,

    } = this.props

    return {

    }
  }
}





export default FuelRatsApp
