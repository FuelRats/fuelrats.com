// Module imports
const router = require('koa-router')()
const send = require('koa-send')

// Component imports
const routes = require('../../routes')




module.exports = (nextjs, koa) => {
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
    const {
      day,
      month,
      slug,
      year,
    } = ctx.params

    const dayIsValid = parseInt(day, 10) && (day.length === 2)
    const monthIsValid = parseInt(month, 10) && (month.length === 2)
    const yearIsValid = parseInt(year, 10) && (year.length === 4)

    if (dayIsValid && monthIsValid && yearIsValid) {
      ctx.status = 301
      await ctx.redirect(`/blog/${slug}`)
    }

    await next()
  })

  // Permanent Redirects
  router.all('/blogs', async ctx => {
    ctx.status = 301
    await ctx.redirect('/blog')
  })

  router.all('/get-help', async ctx => {
    ctx.status = 301
    await ctx.redirect('/i-need-fuel')
  })

  router.all('/fuel-rats-lexicon', async ctx => {
    ctx.status = 301
    await ctx.redirect('https://confluence.fuelrats.com/pages/viewpage.action?pageId=3637257')
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
