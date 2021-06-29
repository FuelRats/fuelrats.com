/* eslint-env node */
'use strict'

import Router from '@koa/router'
import Koa from 'koa'
import koaBody from 'koa-body'
import koaCompress from 'koa-compress'
import koaLogger from 'koa-logger'
import createNextServer from 'next'

import getEnv from '../util/server/getEnv'
import fuelratsCSP from './middlewares/fuelratsCSP'





// Constants
const env = getEnv()
const server = new Koa()
const router = new Router()

const nextApp = createNextServer({
  dev: process.env.NODE_ENV !== 'production',
})
const nextHandler = nextApp.getRequestHandler()





async function init () {
  // Prepare nextApp
  await nextApp.prepare()

  // Set up console logger
  server.use(koaLogger())

  // Add CSP
  server.use(fuelratsCSP())

  // Compress responses
  server.use(koaCompress())

  // Parse request bodies
  server.use(koaBody())

  // Add routes
  router.all('(.*)', async (ctx) => {
    await nextHandler(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())

  // Start the server
  server.listen(env.port, () => {
    console.log('--- Ready')
  })
}

init()
