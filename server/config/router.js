/* eslint-disable */
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

  // Legacy Wordpress permalinks
  // e.g. /2017/09/07/universal-service-a-fuel-rats-thargoid-cartoon
  router.get('/:year/:month/:day/:slug', async (ctx, next) => {
    let {
      day,
      month,
      slug,
      year,
    } = ctx.params

    let dayIsValid = parseInt(day) && (day.length === 2)
    let monthIsValid = parseInt(month) && (month.length === 2)
    let yearIsValid = parseInt(year) && (year.length === 4)

    if (dayIsValid && monthIsValid && yearIsValid) {
      ctx.status = 301
      return await ctx.redirect(`/blog/${slug}`)
    }

    await next()
  })

  // Permanent Redirects
  router.all('/blogs', async (ctx, next) => {
    ctx.status = 301
    await ctx.redirect(`/blog`)
  })

  router.all('/get-help', async (ctx, next) => {
    ctx.status = 301
    await ctx.redirect(`/i-need-fuel`)
  })

  router.all('/fuel-rats-lexicon', async (ctx, next) => {
    ctx.status = 301
    await ctx.redirect(`https://confluence.fuelrats.com/pages/viewpage.action?pageId=3637257`)
  })

  // Temporary Redirects
  router.all('/privacy-policy', async (ctx, next) => {
    ctx.status = 307
    await ctx.redirect(`https://confluence.fuelrats.com/display/FRKB/Privacy+Policy`)
  })

  router.all('/terms-of-service', async (ctx, next) => {
    ctx.status = 307
    await ctx.redirect(`https://confluence.fuelrats.com/display/FRKB/Terms+of+Service`)
  })

  router.all('/code-of-conduct', async (ctx, next) => {
    ctx.status = 307
    await ctx.redirect(`https://confluence.fuelrats.com/display/FRKB/Code+of+Conduct`)
  })





  /******************************************************************************\
    Parameterized routes
  \******************************************************************************/

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
/* eslint-enable */
