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





module.exports = function (nextjs, koa, config) {

  /******************************************************************************\
    Router setup
  \******************************************************************************/

  let handle = nextjs.getRequestHandler()

  router.use(cookie.default())





  /******************************************************************************\
    Authenticated routes
  \******************************************************************************/

  let authenticatedRoutes = [
    '/admin/*',
    '/paperwork',
    '/paperwork/*',
    '/profile',
  ]

  router.get(authenticatedRoutes, async (ctx, next) => {
    if (ctx.cookie && ctx.cookie.access_token) {
      await next()

    } else {
      await ctx.redirect(`/?authenticate=true&destination=${ctx.request.url}`)
    }
  })





  /******************************************************************************\
    Parameterized routes
  \******************************************************************************/

  router.get('/blogs/page/:page', async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/blogs', Object.assign({}, ctx.query, ctx.params))
  })

  router.get('/blog/:id', async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/blog', Object.assign({}, ctx.query, ctx.params))
  })

  router.get('/paperwork/:id/edit', async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/paperwork/edit', Object.assign({}, ctx.query, ctx.params))
  })

  router.get(['/paperwork/:id', '/paperwork/:id/view'], async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/paperwork/view', Object.assign({}, ctx.query, ctx.params))
  })





  /******************************************************************************\
    Fallthrough routes
  \******************************************************************************/

  router.get('*', async ctx => {
    if (ctx.cookie && ctx.cookie.access_token && ctx.query.authenticate) {
      let destination = '/profile'

      if (ctx.query.destination) {
        destination = ctx.query.destination
      }

      await ctx.redirect(destination)

    } else {
      await handle(ctx.req, ctx.res)
      ctx.respond = false
    }
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
