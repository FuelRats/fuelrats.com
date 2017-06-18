'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const next = require('next')
const path = require('path')
const request = require('request-promise-native')
const router = require('koa-router')()
const send = require('koa-send')





module.exports = function (next, koa, config) {

  /******************************************************************************\
    GET routes
  \******************************************************************************/

  let handle = next.getRequestHandler()

  router.all('/api/*', async ctx => {
    try {
      let response = await request({
        body: ctx.request.body,
        json: true,
        method: ctx.request.method,
        resolveWithFullResponse: true,
        uri: `${config.api.url}${ctx.request.url.replace(/^\/api/, '')}`
      })

      console.log(response)
      ctx.body = response.body

    } catch (error) {
      ctx.body = error
    }
  })

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  koa.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })





  /******************************************************************************\
    Attach the router to the app
  \******************************************************************************/

  koa.use(router.routes())
  koa.use(router.allowedMethods())
}
