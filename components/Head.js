import NProgress from 'nprogress'
import NextHead from 'next/head'
import React from 'react'




import { Router } from '../routes'





NProgress.configure({ showSpinner: false })

Router.onRouteChangeStart = () => NProgress.start()

Router.onRouteChangeError = () => NProgress.done()

Router.onRouteChangeComplete = () => NProgress.done()





/* eslint-disable react/no-danger */
export default props => (
  <NextHead>
    <title>{props.title} | Fuelrats.com</title>
    <link rel="stylesheet" href="/_next/static/style.css" />
  </NextHead>
)
/* eslint-enable */
