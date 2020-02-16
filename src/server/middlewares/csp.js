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
  'www.google.com',
]





module.exports = ({ isDev, publicUrl }) => {
  return async (ctx, next) => {
    const nonce = uuidv4()

    ctx.res.nonce = nonce /* eslint-disable-line no-param-reassign */

    const policyString = buildCSP({
      directives: {
        defaultSrc: ["'self'", ...domainWhitelist, 'blob:'],
        connectSrc: [
          "'self'",
          'wss://*.fuelrats.com',
          ...(isDev
            ? [
              publicUrl,
              'webpack://*',
            ]
            : []),
        ],
        baseUri: ["'none'"],
        scriptSrc: [
          "'self'",
          `'nonce-${nonce}'`,
          "'strict-dynamic'",
          ...(isDev ? ["'unsafe-eval'"] : []),
        ],
        styleSrc: ["'self'", "'unsafe-inline'", ...domainWhitelist],
        imgSrc: ["'self'", ...domainWhitelist, 'api.adorable.io', '*.wp.com', 'blob:'],
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
}
