const DEFAULT_PORT = 3000

const env = Object.freeze({
  appUrl: process.env.APP_URL,
  proxied: process.env.APP_PROXIED,
  isDev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT ?? DEFAULT_PORT,
  fallbackUrl: process.env.FR_FALLBACK_URL ?? 'https://fallback.fuelrats.com/',
  frapi: {
    url: process.env.FR_API_URL ?? 'https://dev.api.fuelrats.com',
    proxy: `${process.env.APP_URL}/api/fr`,
    socket: process.env.FR_SOCKET_URL ?? 'wss://dev.api.fuelrats.com',
    clientId: process.env.FR_API_KEY,
    clientSecret: process.env.FR_API_SECRET,
  },
  edsm: {
    url: process.env.FR_EDSM_API_URL ?? 'https://www.edsm.net',
    proxy: `${process.env.APP_URL}/api/edsm`,
  },
  wordpress: {
    url: process.env.FR_WORDPRESS_URL ?? 'https://wordpress.fuelrats.com',
    proxy: `${process.env.APP_URL}/api/wp`,
  },
  stripe: {
    url: `${process.env.APP_URL}/api/stripe`,
    public: process.env.FR_STRIPE_API_PK,
    secret: process.env.FR_STRIPE_API_SK,
    bansFile: process.env.FR_STRIPE_BANS_FILE,
  },
  qms: {
    url: process.env.QMS_API_URL ?? 'https://api.qms.fuelrats.dev',
    token: process.env.QMS_API_TOKEN,
  },
  irc: {
    client: process.env.FR_CLIENT_IRC_URL ?? 'https://qms.fuelrats.dev',
    rat: process.env.FR_RAT_IRC_URL ?? 'https://kiwi.fuelrats.com',
  },
})

module.exports = env
