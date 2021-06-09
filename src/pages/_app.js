import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import withRedux from 'next-redux-wrapper'
import App from 'next/app'
import NextHead from 'next/head'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'

import Header from '~/components/Header'
import LoginModal from '~/components/LoginModal'
import NProgress from '~/components/NProgress'
import SilentBoundary from '~/components/SilentBoundary'
import UserMenu from '~/components/UserMenu'
import * as faIcons from '~/helpers/faIconLibrary'
import { resolvePageMeta } from '~/helpers/gIPTools'
import { initStore } from '~/store'
import {
  initUserSession,
  notifyPageDestroyed,
  notifyPageLoading,
} from '~/store/actions/session'

import ErrorPage from './_error'

import '~/scss/app.scss'





// Configure and populate FontAwesome library
faConfig.autoAddCss = false
faLibrary.add(faIcons)

const pageMotionConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    type: 'spring',
    mass: 2,
    stiffness: 450,
    damping: 50,
  },
}





@withRedux(initStore)
class FuelRatsApp extends App {
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
      initialProps.pageProps.message = ctx.err.message
      initialProps.pageMeta = await resolvePageMeta(ErrorPage, ctx, initialProps.pageProps)
    } else {
      initialProps.pageMeta = await resolvePageMeta(Component, ctx, initialProps.pageProps)
    }

    await ctx.store.dispatch(notifyPageLoading(appCtx))

    return initialProps
  }

  handlePageDestroy = () => {
    this.props.store.dispatch(notifyPageDestroyed())
  }

  render () {
    const { store } = this.props

    const {
      Page,
      pageProps,
      pageMeta,
      key,
    } = this.pageData

    const {
      title,
      description,
      forceDrawer,
      noHeader,
      className,
      displayTitle,
    } = pageMeta

    return (
      <StrictMode>
        <NextHead>
          <title>{`${title} | The Fuel Rats`}</title>
          <meta content="initial-scale=1.0, viewport-fit=cover, width=device-width" name="viewport" />
          <meta content={title} property="og:title" />
          <meta content={description} name="description" />
          <meta content={description} property="og:description" />
        </NextHead>
        <LazyMotion strict features={domAnimation}>
          <div className={{ forceDrawer }} id="FuelRatsApp" role="application">
            <Provider store={store}>
              <NProgress />
              <Header />
              <UserMenu />

              <AnimatePresence initial={false} onExitComplete={this.handlePageDestroy}>
                <m.main
                  key={key}
                  {...pageMotionConfig}
                  className={['page', title.toLowerCase().replace(/\s/gu, '-'), className]}>
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
                </m.main>
              </AnimatePresence>

              <LoginModal />
            </Provider>
          </div>
        </LazyMotion>
      </StrictMode>
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
      Page,
      pageProps,
      pageMeta,
      key: pageMeta.pageKey ?? router.asPath,
    }
  }
}





export default FuelRatsApp
