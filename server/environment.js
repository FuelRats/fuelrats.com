/* eslint-env node */

// Constants
const DEFAULT_PORT = 3000



module.exports = {
  isDev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || DEFAULT_PORT,
  api: {
    clientId: process.env.FRDC_API_KEY,
    clientSecret: process.env.FRDC_API_SECRET,
    url: process.env.FRDC_API_URL || 'http://localhost:8080',
  },
  edsm: {
    url: process.env.FRDC_EDSM_API_URL || 'https://www.edsm.net',
  },
  wordpress: {
    url: process.env.FRDC_WORDPRESS_URL || 'https://wordpress.fuelrats.com',
  },
}
