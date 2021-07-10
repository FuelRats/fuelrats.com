const nextSafe = require('next-safe')





const domainWhitelist = [
  '*.fuelrats.com',
  '*.stripe.com',
  'www.google.com',
]





module.exports = (env) => {
  return () => {
    return [
      {
        source: '/:path*',
        headers: nextSafe({
          isDev: env.isDev,
          contentSecurityPolicy: {
            'default-src': ["'self'", ...domainWhitelist, 'blob:'],
            'connect-src': ["'self'", 'wss://*.fuelrats.com', env.frapi.url, env.appUrl],
            'object-src': ["'self'"],
            'font-src': ["'self'", 'fonts.gstatic.com'],
            'style-src': ["'self'", "'unsafe-inline'", ...domainWhitelist, 'fonts.googleapis.com'],
            'img-src': ["'self'", ...domainWhitelist, '*.wp.com', 'blob:', 'data:'],
          },
        }),
      },
    ]
  }
}
