const nextSafe = require('next-safe')





module.exports = (env) => {
  return () => {
    return [
      {
        source: '/:path*',
        headers: nextSafe({
          isDev: env.isDev,
          contentSecurityPolicy: {
            'default-src': ["'self'", '*.fuelrats.com'],
            'script-src': ["'self'", '*.stripe.com'],
            'connect-src': ["'self'", 'wss://*.fuelrats.com', env.frapi.url, env.appUrl],
            'object-src': ["'self'", 'data:'],
            'font-src': ["'self'", 'fonts.gstatic.com'],
            'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            'img-src': ["'self'", '*.wp.com', 'blob:', 'data:'],
            'frame-src': ['https://js.stripe.com'],
            'child-src': false,
            'prefetch-src': false,
            'worker-src': false,
          },
        }),
      },
    ]
  }
}
