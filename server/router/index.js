/* eslint-disable global-require */

// Module imports
const router = require('koa-router')()





module.exports = (nextApp, koaServer, env) => {
  /***************************************************************************\
    Routes
  \***************************************************************************/

  // Redirects
  require('./redirects')(router)


  /***************************************************************************\
    Next.js Passthrough
  \***************************************************************************/

  const nextRequestHandler = nextApp.getRequestHandler()
  router.get('*', async (ctx) => {
    ctx.respond = false
    await nextRequestHandler(ctx.req, ctx.res)
  })





  /***************************************************************************\
    Configure server and attach router.
  \***************************************************************************/

  koaServer.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })
  koaServer.use(router.routes())
  koaServer.use(router.allowedMethods())
}
/* eslint-enable */
