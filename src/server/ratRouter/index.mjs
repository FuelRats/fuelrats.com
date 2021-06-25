import Router from '@koa/router'

import stripeApi from './stripeApi'
import wpRedirect from './wpRedirect'





const ratRouter = (nextApp, koaServer) => {
  const router = new Router()


  /***************************************************************************\
    Routes
  \***************************************************************************/

  // Redirects
  wpRedirect(router)

  // Stripe Api
  stripeApi(router)





  /***************************************************************************\
    Next.js Passthrough
  \***************************************************************************/

  const nextRequestHandler = nextApp.getRequestHandler()
  router.get('(.*)', async (ctx) => {
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





export default ratRouter
