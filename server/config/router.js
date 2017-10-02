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
    '/authorize'
  ]

  router.get(authenticatedRoutes, async (ctx, next) => {
    if (ctx.cookie && ctx.cookie.access_token) {
      await next()

    } else {
      await ctx.redirect(`/?authenticate=true&destination=${encodeURIComponent(ctx.request.url)}`)
    }
  })





  /******************************************************************************\
    Redirects
  \******************************************************************************/

  router.get('/blogs', async (ctx, next) => {
    ctx.status = 302
    await ctx.redirect(`/blog`)
  })

  router.get('/fuel-rats-lexicon', async (ctx, next) => {
    ctx.status = 301
    await ctx.redirect(`https://confluence.fuelrats.com/pages/viewpage.action?pageId=3637257`)
  })

  router.get('/get-help', async (ctx, next) => {
    ctx.status = 302
    await ctx.redirect(`/i-need-fuel`)
  })

  router.get('/privacy-policy', async (ctx, next) => {
    ctx.status = 302
    await ctx.redirect(`https://confluence.fuelrats.com/display/FRKB/Privacy+Policy`)
  })

  router.get('/terms-of-service', async (ctx, next) => {
    ctx.status = 302
    await ctx.redirect(`https://confluence.fuelrats.com/display/FRKB/Terms+of+Service`)
  })





  /******************************************************************************\
    Parameterized routes
  \******************************************************************************/

  // Single blog
  router.get('/blog/:id', async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/blog/single', Object.assign({}, ctx.query, ctx.params))
    ctx.respond = false
  })

  // Blog catch all
  let blogListRoutes = [
    '/blog/author/:author/page/:page',
    '/blog/author/:author',
    '/blog/category/:category/page/:page',
    '/blog/category/:category',
    '/blog/page/:page',
    '/blog',
  ]
  router.get(blogListRoutes, async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/blog/all', Object.assign({}, ctx.query, ctx.params))
    ctx.respond = false
  })

  router.get('/paperwork/:id/edit', async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/paperwork/edit', Object.assign({}, ctx.query, ctx.params))
    ctx.respond = false
  })

  router.get(['/paperwork/:id', '/paperwork/:id/view'], async (ctx, next) => {
    await nextjs.render(ctx.request, ctx.res, '/paperwork/view', Object.assign({}, ctx.query, ctx.params))
    ctx.respond = false
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
