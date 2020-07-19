/* eslint-env node */
'use strict'





// Module imports
import Koa from 'koa'
import koaBody from 'koa-body'
import koaCompress from 'koa-compress'
import koaLogger from 'koa-logger'
import koaNoTrailingSlash from 'koa-no-trailing-slash'
import createNextServer from 'next'





// Component imports
import env from './environment'
import configureCSP from './middlewares/csp'
import proxies from './middlewares/proxy'
import uaRedirect from './middlewares/ua-redirect'
import router from './router'





// Constants
const server = new Koa()
server.proxy = env.proxyEnabled

const nextApp = createNextServer({
  dev: env.isDev,
})





;(async function init () {
  // Prepare nextApp
  await nextApp.prepare()

  // Redirect any incompatible browsers to fallback website
  server.use(uaRedirect({ IE: true }, env.fallbackUrl))

  // Inject env into context.
  server.use(async (ctx, next) => {
    ctx.state.env = env
    await next()
  })

  // Rewrite URLS to remove trailing slashes
  server.use(koaNoTrailingSlash())

  // Set up console logger
  server.use(koaLogger())

  // Add CSP
  server.use(configureCSP())

  // Add proxies
  proxies(server, env)

  // Compress responses
  server.use(koaCompress())

  // Parse request bodies
  server.use(koaBody())

  // Add routes
  router(nextApp, server)

  // Start the server
  server.listen(env.port)
}())
