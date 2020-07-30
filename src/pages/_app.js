// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { animated } from '@react-spring/web'
import withRedux from 'next-redux-wrapper'
import App from 'next/app'
import NextHead from 'next/head'
import React from 'react'
import { Provider } from 'react-redux'

import PageTransitionContainer from '~/components/AppLayout/PageTransitionContainer'
import Header from '~/components/Header'
import LoginModal from '~/components/LoginModal'
import NProgress from '~/components/NProgress'
import SilentBoundary from '~/components/SilentBoundary'
import UserMenu from '~/components/UserMenu'
import * as faIcons from '~/helpers/faIconLibrary'
import { resolvePageMeta } from '~/helpers/gIPTools'
import frApi from '~/services/fuelrats'
import { initStore } from '~/store'
import { initUserSession, notifyPageLoading } from '~/store/actions/session'

import ErrorPage from './_error'

import '~/scss/app.scss'





// Configure and populate FontAwesome library
faConfig.autoAddCss = false
faLibrary.add(faIcons)





@withRedux(initStore)
class FuelRatsApp extends App {
  constructor (props) {
    super(props)

    if (props.accessToken) {
      frApi.defaults.headers.common.Authorization = `Bearer ${props.accessToken}`
    }
  }


  static async getInitialProps (appCtx) {
    const { Component, ctx } = appCtx

    await ctx.store.dispatch(initUserSession(ctx))

    const initialProps = {
      accessToken: ctx.accessToken,
      pageProps: {
        asPath: ctx.asPath,
        query: ctx.query,
        ...((await Component.getInitialProps?.(ctx)) ?? {}),
      },
    }

    if (ctx.err) {
      initialProps.isError = true
      initialProps.pageProps = (await ErrorPage.getInitialProps?.(ctx)) ?? {}
      initialProps.pageMeta = await resolvePageMeta(ErrorPage, ctx, initialProps.pageProps)
    } else {
      initialProps.pageMeta = await resolvePageMeta(Component, ctx, initialProps.pageProps)
    }

    await ctx.store.dispatch(notifyPageLoading(appCtx))

    return initialProps
  }

  renderPage = (style, item) => {
    const { Page, pageProps, pageMeta } = item

    const {
      title,
      displayTitle,
      noHeader,
    } = pageMeta

    return (
      <animated.main
        className={['page', title.toLowerCase().replace(/\s/gu, '-'), pageMeta.className]}
        style={style}>
        {
          !noHeader && (
            <header className="page-header">
              <h1>
                {displayTitle ?? title}
              </h1>
            </header>
          )
        }
        <SilentBoundary>
          <Page {...pageProps} />
        </SilentBoundary>
      </animated.main>
    )
  }

  render () {
    const {
      pageMeta,
      store,
    } = this.props

    return (
      <React.StrictMode>
        <NextHead>
          <title>{`${pageMeta.title} | The Fuel Rats`}</title>
          <meta content="initial-scale=1.0, viewport-fit=cover, width=device-width" name="viewport" />
          <meta content={pageMeta.title} property="og:title" />
          <meta content={pageMeta.description} name="description" />
          <meta content={pageMeta.description} property="og:description" />
        </NextHead>
        <div role="application">
          <Provider store={store}>
            <NProgress />
            <Header />
            <UserMenu />

            <PageTransitionContainer {...this.pageData}>
              {this.renderPage}
            </PageTransitionContainer>

            <LoginModal />
          </Provider>
        </div>
      </React.StrictMode>
    )
  }


  get pageData () {
    const {
      Component,
      isError,
      pageMeta,
      pageProps,
      router,
    } = this.props

    let Page = Component

    if (isError) {
      Page = ErrorPage
    }

    return {
      items: { Page, pageProps, pageMeta },
      keys: pageMeta.pageKey ?? router.asPath,
    }
  }
}





export default FuelRatsApp
