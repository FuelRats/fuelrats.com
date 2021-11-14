const nextSafe = require('next-safe')


module.exports = ({ isDev, frapi, appUrl }) => {
  // Some headers are set by our reverse proxy in prod, so they should be disabled ouside of dev environments.
  const defaultIfDev = isDev ? undefined : false
  return () => {
    return [
      {
        source: '/:path*',
        headers: nextSafe({
          isDev,
          contentSecurityPolicy: {
            'default-src': ["'self'", '*.fuelrats.com'],
            'script-src': ["'self'", '*.stripe.com'],
            'connect-src': ["'self'", 'wss://*.fuelrats.com', frapi.url, appUrl],
            'object-src': ["'self'", 'data:'],
            'font-src': ["'self'", 'fonts.gstatic.com'],
            'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            'img-src': ["'self'", '*.wp.com', 'blob:', 'data:'],
            'frame-src': ['https://js.stripe.com'],
            'child-src': false,
            'prefetch-src': false,
            'worker-src': false,
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
