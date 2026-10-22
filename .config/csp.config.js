const nextSafe = require('next-safe')


/**
 * Content-Security-Policy headers for a single response.
 *
 * Production pages carry inline bootstrap scripts, so script-src allows them through a per-request nonce. Development
 * omits the nonce, since browsers ignore next-safe's development 'unsafe-inline' allowance whenever a nonce is present.
 * @param {object} env App environment from `.config/env`.
 * @param {boolean} env.isDev Whether the app runs in development.
 * @param {object} env.frapi Fuel Rats API configuration.
 * @param {string} env.appUrl Public URL of this app.
 * @param {string} nonce Nonce generated for this response.
 * @returns {Array<{ key: string, value: string }>} CSP headers.
 */
module.exports = ({ isDev, frapi, appUrl }, nonce) => {
  return nextSafe({
    isDev,
    contentSecurityPolicy: {
      'default-src': ["'self'", '*.fuelrats.com'],
      'script-src': ["'self'", ...(isDev ? [] : [`'nonce-${nonce}'`]), '*.stripe.com'],
      'connect-src': ["'self'", 'wss://*.fuelrats.com', frapi.url, frapi.socket, appUrl],
      'object-src': ["'self'", 'data:'],
      'font-src': ["'self'", 'fonts.gstatic.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      'img-src': ["'self'", '*.wp.com', 'blob:', 'data:'],
      'frame-src': ['https://js.stripe.com'],
      'child-src': false,
      'prefetch-src': false,
      'worker-src': ["'self'"],
    },
    permissionsPolicy: false,
    frameOptions: false,
    contentTypeOptions: false,
    referrerPolicy: false,
    xssProtection: false,
  })
}
