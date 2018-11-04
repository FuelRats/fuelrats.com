/* eslint-env node */

// Module imports
const buildCSP = require('content-security-policy-builder')
const uuidv4 = require('uuid/v4')





// Constants
const headerKeys = [
  'Content-Security-Policy',
  'X-Content-Security-Policy',
  'X-WebKit-CSP',
]





module.exports = isDev => async (ctx, next) => {
  const nonce = uuidv4()

  ctx.res.nonce = nonce /* eslint-disable-line no-param-reassign */

  const policyString = buildCSP({
    directives: {
      scriptSrc: [
        "'self'",
        `'nonce-${nonce}'`,
        "'unsafe-inline'",
        '*.fuelrats.com',
        '*.stripe.com',
        ...(isDev ? ["'unsafe-eval'"] : []),
      ],
    },
  })

  headerKeys.forEach((key) => {
    ctx.response.set(key, policyString)
  })

  await next()
}
