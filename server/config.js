module.exports = {
  api: {
    url: process.env.FRDC_API_URL || 'http://localhost:8080'
  },
  edsm: {
    url: process.env.FRDC_EDSM_API_URL || 'https://www.edsm.net'
  },
  wordpress: {
    username: process.env.FRDC_WORDPRESS_USERNAME,
    password: process.env.FRDC_WORDPRESS_PASSWORD,
    url: process.env.FRDC_WORDPRESS_URL || 'https://fuelrats.com'
  }
}
