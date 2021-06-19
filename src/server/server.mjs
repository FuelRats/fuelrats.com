/* eslint-env node */
'use strict'

import Koa from 'koa'
import koaBody from 'koa-body'
import koaCompress from 'koa-compress'
import koaLogger from 'koa-logger'
import createNextServer from 'next'

import getEnv from './helpers/getEnv'
import fuelratsCSP from './middlewares/fuelratsCSP'
import fuelratsProxy from './middlewares/fuelratsProxy'
import uaRedirect from './middlewares/uaRedirect'
import ratRouter from './ratRouter'





// Constants
const server = new Koa()

const nextApp = createNextServer({
  dev: process.env.NODE_ENV !== 'production',
})





;(async function init () {
  // Prepare nextApp
  await nextApp.prepare()

  // get env
  const env = getEnv()

  // Redirect any incompatible browsers to fallback website
  server.use(uaRedirect({ IE: true }, env.fallbackUrl))

  // Inject env into context.
  server.use(async (ctx, next) => {
    ctx.state.env = env
    await next()
  })

  // Set up console logger
  server.use(koaLogger())

  // Add CSP
  server.use(fuelratsCSP())

  // Add proxies
  fuelratsProxy(server, env)

  // Compress responses
  server.use(koaCompress())

  // Parse request bodies
  server.use(koaBody())

  // Add routes
  ratRouter(nextApp, server)

  // Start the server
  server.listen(env.port)
}())
