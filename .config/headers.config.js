const nextSafe = require('next-safe')


module.exports = ({ isDev }) => {
  // Some headers are set by our reverse proxy in prod, so they should be disabled ouside of dev environments.
  const defaultIfDev = isDev ? undefined : false
  return () => {
    return [
      {
        source: '/:path*',
        headers: nextSafe({
          isDev,
          // Set per request by `src/proxy.js` so it can carry a nonce
          contentSecurityPolicy: false,
          permissionsPolicy: {
            'clipboard-read': "'self'",
            'clipboard-write': "'self'",
            'publickey-credentials-get': "'self'",
            'web-share': "'self'",
          },
          frameOptions: defaultIfDev,
          contentTypeOptions: defaultIfDev,
          referrerPolicy: defaultIfDev,
          xssProtection: defaultIfDev,
        }),
      },
    ]
  }
}
