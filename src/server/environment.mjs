/* eslint-env node */

// Constants
const DEFAULT_PORT = 3000





function getEnv () {
  return {
    isDev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT ?? DEFAULT_PORT,
    publicUrl: process.env.APP_URL,
    fallbackUrl: process.env.FR_FALLBACK_URL ?? 'https://fallback.fuelrats.com/',
    api: {
      clientId: process.env.FR_API_KEY,
      clientSecret: process.env.FR_API_SECRET,
      url: process.env.FR_API_URL ?? 'https://dev.api.fuelrats.com',
    },
    edsm: {
      url: process.env.FR_EDSM_API_URL ?? 'https://www.edsm.net',
    },
    wordpress: {
      url: process.env.FR_WORDPRESS_URL ?? 'https://wordpress.fuelrats.com',
    },
    stripe: {
      secret: process.env.FR_STRIPE_API_SK,
      bansFile: process.env.FR_STRIPE_BANS_FILE,
    },
  }
}





export default getEnv
