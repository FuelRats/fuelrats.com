// Module imports
const proxy = require('koa-proxies')





module.exports = (koa, config) => {
  /***************************************************************************\
    Proxy Fuelrats API requests
  \***************************************************************************/

  koa.use(proxy('/api/oauth2/token', {
    auth: `${config.api.clientId}:${config.api.clientSecret}`,
    changeOrigin: true,
    jar: true,
    rewrite: path => path.replace(/^\/api/u, ''),
    secure: true,
    target: config.api.url,
  }))

  koa.use(proxy('/api', {
    changeOrigin: true,
    jar: true,
    rewrite: path => path.replace(/^\/api/u, ''),
    secure: true,
    target: config.api.url,
  }))





  /***************************************************************************\
    Proxy EDSM API requests
  \***************************************************************************/

  koa.use(proxy('/edsm-api', {
    changeOrigin: true,
    rewrite: path => path.replace(/^\/edsm-api/u, ''),
    target: config.edsm.url,
  }))





  /***************************************************************************\
    Proxy Wordpress requests
  \***************************************************************************/

  koa.use(proxy('/wp-api', {
    changeOrigin: true,
    rewrite: path => path.replace(/^\/wp-api/u, '/wp-json/wp/v2'),
    target: config.wordpress.url,
  }))

  koa.use(proxy('/wp-content', {
    target: config.wordpress.url,
  }))
}
