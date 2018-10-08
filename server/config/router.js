/* eslint-disable */
'use strict'

// Module imports
const router = require('koa-router')()
const routes = require('../../routes')





module.exports = function (nextjs, koa) {
  /******************************************************************************\
    Router setup
  \******************************************************************************/

  const nextRoutesHandler = routes.getRequestHandler(nextjs)





  /******************************************************************************\
    Redirects
  \******************************************************************************/

  // SEO Stuff
  router.get('/browserconfig.xml', async ctx => {
    await send(ctx, '/static/browserconfig.xml')
  })

  router.get('/sitemap.xml', async ctx => {
    await send(ctx, '/static/sitemap.xml')
  })

  router.get('/manifest.json', async ctx => {
    await send(ctx, '/static/manifest.json')
  })

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





  /******************************************************************************\
    Fallthrough routes
  \******************************************************************************/

  // Pass off to next-routes
  router.get('*', async ctx => {
    await nextRoutesHandler(ctx.req, ctx.res)
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
/* eslint-enable */
