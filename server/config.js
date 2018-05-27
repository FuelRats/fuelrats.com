module.exports = {
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
