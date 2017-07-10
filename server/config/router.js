'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const { URL } = require('url')
const cookie = require('koa-cookie')
const next = require('next')
const path = require('path')
const request = require('request-promise-native')
const router = require('koa-router')()
const send = require('koa-send')





module.exports = function (nextjs, koa, config) {

  /******************************************************************************\
    GET routes
  \******************************************************************************/

  let handle = nextjs.getRequestHandler()

  let authenticatedRoutes = [
    '/profile',
    '/admin/*',
  ]

  router.use(cookie.default())

  router.get(authenticatedRoutes, async (ctx, next) => {
    if (ctx.cookie && ctx.cookie.access_token) {
      await next()
    }

    await ctx.redirect(`/?authenticate=true&destination=${ctx.request.url}`)
  })

  router.get('/paperwork/:id', async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/paperwork', Object.assign({}, ctx.query, ctx.params))
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
