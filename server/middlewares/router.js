// Module imports
const router = require('koa-router')()
const send = require('koa-send')





// Component imports
const routes = require('../../client/routes')





// Component constants
const DAY_CHAR_LENGTH = 2
const MONTH_CHAR_LENGTH = 2
const YEAR_CHAR_LENGTH = 4





const permanentRedirect = path => async (ctx) => {
  ctx.status = 301
  await ctx.redirect(path)
}

const sendFile = path => async (ctx) => {
  await send(ctx, path)
}





module.exports = (nextjs, koa) => {
  /***************************************************************************\
    Redirects
  \***************************************************************************/

  // SEO Stuff
  router.get('/browserconfig.xml', sendFile('/client/static/browserconfig.xml'))
  router.get('/sitemap.xml', sendFile('/client/static/sitemap.xml'))
  router.get('/manifest.json', sendFile('/client/static/manifest.json'))
  router.get('/favicon.ico', sendFile('/client/static/favicon/favicon.ico'))




  // Legacy Wordpress permalinks
  // e.g. /2017/09/07/universal-service-a-fuel-rats-thargoid-cartoon
  router.get('/:year/:month/:day/:slug', async (ctx, next) => {
    const {
      day,
      month,
      slug,
      year,
    } = ctx.params

    const dayIsValid = parseInt(day, 10) && (day.length === DAY_CHAR_LENGTH)
    const monthIsValid = parseInt(month, 10) && (month.length === MONTH_CHAR_LENGTH)
    const yearIsValid = parseInt(year, 10) && (year.length === YEAR_CHAR_LENGTH)

    if (dayIsValid && monthIsValid && yearIsValid) {
      ctx.status = 301
      await ctx.redirect(`/blog/${slug}`)
    }

    await next()
  })





  // Permanent Redirects
  router.all('/blogs', permanentRedirect('/blog'))

  router.all('/get-help', permanentRedirect('/i-need-fuel'))

  router.all('/fuel-rats-lexicon', permanentRedirect('https://confluence.fuelrats.com/pages/viewpage.action?pageId=3637257'))

  router.all('/help', permanentRedirect('https://t.fuelr.at/help'))





  /***************************************************************************\
    Fallthrough routes
  \***************************************************************************/

  // Pass off to next-routes
  const nextRoutesHandler = routes.getRequestHandler(nextjs)
  router.get('*', async (ctx) => {
    await nextRoutesHandler(ctx.req, ctx.res)
    ctx.respond = false
  })

  koa.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })





  /***************************************************************************\
    Attach router to server
  \***************************************************************************/

  koa.use(router.routes())
  koa.use(router.allowedMethods())
}
/* eslint-enable */
