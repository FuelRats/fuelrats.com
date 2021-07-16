const nextSafe = require('next-safe')





module.exports = (env) => {
  return () => {
    return [
      {
        source: '/:path*',
        headers: nextSafe({
          isDev: env.isDev,
          contentSecurityPolicy: {
            'default-src': ["'self'", '*.fuelrats.com', 'blob:'],
            'script-src': ["'self'", '*.stripe.com'],
            'connect-src': ["'self'", 'wss://*.fuelrats.com', env.frapi.url, env.appUrl],
            'object-src': ["'self'"],
            'font-src': ["'self'", 'fonts.gstatic.com'],
            'style-src': ["'self'", 'fonts.googleapis.com'],
            'img-src': ["'self'", '*.wp.com', 'blob:', 'data:'],
            'frame-src': ['https://js.stripe.com'],
          },
        }),
      },
    ]
  }
}
