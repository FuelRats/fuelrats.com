// Module imports
import buildCSP from 'content-security-policy-builder'
import UUID from 'pure-uuid'





// Constants
const UUID_VERSION_4 = 4

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





const configureCSP = () => {
  return async function koaCSP (ctx, next) {
    const {
      isDev,
      publicUrl,
      api,
    } = ctx.state.env

    const nonce = (new UUID(UUID_VERSION_4)).format()

    ctx.res.nonce = nonce

    const policyString = buildCSP({
      directives: {
        defaultSrc: ["'self'", ...domainWhitelist, 'blob:'],
        connectSrc: [
          "'self'",
          'wss://*.fuelrats.com',
          api.url,
          publicUrl,
          ...(isDev ? ['webpack://*'] : []),
        ],
        baseUri: ["'none'"],
        scriptSrc: [
          "'self'",
          `'nonce-${nonce}'`,
          "'strict-dynamic'",
          ...(isDev ? ["'unsafe-eval'"] : []),
        ],
        styleSrc: ["'self'", "'unsafe-inline'", ...domainWhitelist],
        imgSrc: ["'self'", ...domainWhitelist, '*.wp.com', 'blob:'],
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





export default configureCSP
