/* eslint-env node */

const helmet = require('koa-helmet')
const uuidv4 = require('uuid/v4')



// Derived from https://helmetjs.github.io/docs/csp/
module.exports = (koaServer, env) => {
  koaServer.use(({ res }, next) => {
    res.locals.nonce = uuidv4()
    next()
  })

  koaServer.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: [
            "'self'",
            (req, res) => `'nonce-${res.locals.nonce}'`,
            "'strict-dynamic'",
            "'unsafe-inline'",
            '*.fuelrats.com',
            '*.stripe.com',
            ...(env.isDev ? ["'unsafe-eval'"] : []),
          ],
        },
      },
    })
  )
}
