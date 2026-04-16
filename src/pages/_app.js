import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import NextHead from 'next/head'
import { StrictMode, useCallback } from 'react'
import { Provider } from 'react-redux'

import Header from '~/components/Header'
import LoginModal from '~/components/LoginModal'
import NProgress from '~/components/NProgress'
import PageErrorBoundary from '~/components/PageErrorBoundary'
import UserMenu from '~/components/UserMenu'
import {
  initUserSession,
  notifyPageDestroyed,
  notifyPageLoading,
} from '~/store/actions/session'
import '~/util/fontawesome/init'
import resolvePageMeta from '~/util/getInitialProps/resolvePageMeta'
import withReduxStore from '~/util/withReduxStore'

import ErrorPage from './_error'

import '~/scss/app.scss'
import clsx from 'clsx'





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





function FuelRatsApp (props) {
  const {
    Component,
    isError,
    pageMeta,
    pageProps,
    router,
    store,
  } = props

  const Page = isError ? ErrorPage : Component
  const key = pageMeta.key ?? router.asPath

  const {
    title,
    description,
    forceDrawer,
    noHeader,
    className,
    displayTitle,
  } = pageMeta

  const handlePageDestroy = useCallback(() => {
    store.dispatch(notifyPageDestroyed())
  }, [store])

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
        <MotionConfig reducedMotion="user">
        <div className={clsx({ forceDrawer })} id="FuelRatsApp" role="application">
          <Provider store={store}>
            <NProgress />
            <Header />
            <UserMenu />

            <AnimatePresence initial={false} onExitComplete={handlePageDestroy}>
              <m.main
                key={key}
                {...pageMotionConfig}
                className={clsx('page', className)}>
                {
                  !noHeader && (
                    <header className="page-header">
                      <h1>
                        {displayTitle ?? title}
                      </h1>
                    </header>
                  )
                }
                <PageErrorBoundary>
                  <Page {...pageProps} />
                </PageErrorBoundary>
              </m.main>
            </AnimatePresence>

            <LoginModal />
          </Provider>
        </div>
        </MotionConfig>
      </LazyMotion>
    </StrictMode>
  )
}

FuelRatsApp.getInitialProps = async (appCtx) => {
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





export default withReduxStore(FuelRatsApp)
