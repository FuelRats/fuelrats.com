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

const domainWhitelist = [
  '*.fuelrats.com',
  '*.stripe.com',
]





module.exports = isDev => async (ctx, next) => {
  const nonce = uuidv4()

  ctx.res.nonce = nonce /* eslint-disable-line no-param-reassign */

  const policyString = buildCSP({
    directives: {
      defaultSrc: ["'self'", ...domainWhitelist, 'wss://*.fuelrats.com'],
      baseUri: ["'none'"],
      scriptSrc: [
        "'self'",
        `'nonce-${nonce}'`,
        "'strict-dynamic'",
        "'unsafe-inline'",
        ...(isDev ? ["'unsafe-eval'"] : []),
      ],
      styleSrc: ["'self'", "'unsafe-inline'", ...domainWhitelist],
      imgSrc: ["'self'", ...domainWhitelist, 'api.adorable.io', '*.wp.com'],
      mediaSrc: ["'self'"],
      objectSrc: ["'self'"],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
    },
  })

  headerKeys.forEach((key) => {
    ctx.response.set(key, policyString)
  })

  await next()
}
