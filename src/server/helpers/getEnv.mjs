function getEnv () {
  const {
    PORT = 3000,
    APP_URL = `https://localhost:${PORT}`,
    NODE_ENV,
    FR_FALLBACK_URL = 'https://fallback.fuelrats.com/',
    FR_API_SECRET,
    FR_API_KEY,
    FR_API_URL = 'https://dev.api.fuelrats.com',
    FR_EDSM_API_URL = 'https://www.edsm.net',
    FR_WORDPRESS_URL = 'https://wordpress.fuelrats.com',
    FR_STRIPE_API_SK,
    FR_STRIPE_BANS_FILE,
  } = process.env

  return {
    appUrl: APP_URL,
    isDev: NODE_ENV !== 'production',
    port: PORT,
    fallbackUrl: FR_FALLBACK_URL,
    api: {
      url: FR_API_URL,
      clientId: FR_API_KEY,
      clientSecret: FR_API_SECRET,
    },
    edsm: {
      url: FR_EDSM_API_URL,
    },
    wordpress: {
      url: FR_WORDPRESS_URL,
    },
    stripe: {
      secret: FR_STRIPE_API_SK,
      bansFile: FR_STRIPE_BANS_FILE,
    },
  }
}





export default getEnv
