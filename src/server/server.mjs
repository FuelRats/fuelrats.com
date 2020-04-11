/* eslint-env node */
/* eslint-disable strict, global-require */
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
import csp from './middlewares/csp'
import proxies from './middlewares/proxy'
import router from './router'





// Constants
const server = new Koa()
const nextApp = createNextServer({
  dev: env.isDev,
})




;(async function init () {
  // Prepare nextApp
  await nextApp.prepare()

  // Inject env into context.
  server.use((ctx) => {
    ctx.state.env = env
  })

  // Rewrite URLS to remove trailing slashes
  server.use(koaNoTrailingSlash())

  // Set up console logger
  server.use(koaLogger())

  // Add CSP
  server.use(csp)

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
