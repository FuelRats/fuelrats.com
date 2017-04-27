'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const next = require('next')
const path = require('path')
const router = require('koa-router')()
const send = require('koa-send')





module.exports = function (app, config) {

  /******************************************************************************\
    GET routes
  \******************************************************************************/

  let handle = app.next.getRequestHandler()

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
//    await send(ctx, 'index.html')
  })





  /******************************************************************************\
    Attach the router to the app
  \******************************************************************************/

  app.use(router.routes())
  app.use(router.allowedMethods())
}
