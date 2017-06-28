'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const { URL } = require('url')
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

  router.post('/login', async ctx => {
    try {
      console.log(`Basic ${new Buffer(`${config.api.clientId}:${config.api.clientSecret}`).toString('base64')}`)

      let response = await request({
        form: ctx.request.body,
        headers: {
          Authorization: `Basic ${new Buffer(`${config.api.clientId}:${config.api.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'post',
        resolveWithFullResponse: true,
        uri: `${config.api.url}/oauth2/token`
      })

      // Header passthrough
      for (let header in response.headers) {
        ctx.response.set(header, response.headers[header.toLowerCase()])
      }

      console.log('ctx.body', ctx.body)

      ctx.body = response.body
      ctx.statusCode = response.statusCode

    } catch (error) {
      console.log(error)
      ctx.body = error.error
      ctx.statusCode = error.statusCode
    }
  })

  router.all('/api/*', async ctx => {
    try {
      let response = await request({
        body: ctx.request.body,
        json: true,
        method: ctx.request.method,
        resolveWithFullResponse: true,
        uri: `${config.api.url}${ctx.request.url.replace(/^\/api/, '')}`
      })

      // Header passthrough
      for (let header in response.headers) {
        ctx.response.set(header, response.headers[header.toLowerCase()])
      }

      ctx.body = response.body
      ctx.statusCode = response.statusCode

    } catch (error) {
      ctx.body = error.error
      ctx.statusCode = error.statusCode
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
