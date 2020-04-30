// Module imports
import Router from 'koa-router'





// local imports
import redirects from './redirects'
import stripeApi from './stripeApi'





const configureRouter = (nextApp, koaServer) => {
  const router = new Router()


  /***************************************************************************\
    Routes
  \***************************************************************************/

  // Redirects
  redirects(router)

  // Stripe Api
  stripeApi(router)





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





export default configureRouter
