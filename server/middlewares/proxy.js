// Module imports
const proxy = require('koa-proxies')





module.exports = (koaServer, env) => {
  /***************************************************************************\
    Proxy Fuelrats API requests
  \***************************************************************************/

  koaServer.use(proxy('/api/oauth2/token', {
    auth: `${env.api.clientId}:${env.api.clientSecret}`,
    changeOrigin: true,
    jar: true,
    rewrite: (path) => path.replace(/^\/api/u, ''),
    secure: true,
    target: env.api.url,
  }))

  koaServer.use(proxy('/api', {
    changeOrigin: true,
    jar: true,
    rewrite: (path) => path.replace(/^\/api/u, ''),
    secure: true,
    target: env.api.url,
  }))





  /***************************************************************************\
    Proxy EDSM API requests
  \***************************************************************************/

  koaServer.use(proxy('/edsm-api', {
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/edsm-api/u, ''),
    target: env.edsm.url,
  }))





  /***************************************************************************\
    Proxy Wordpress requests
  \***************************************************************************/

  koaServer.use(proxy('/wp-api', {
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/wp-api/u, '/wp-json/wp/v2'),
    target: env.wordpress.url,
  }))

  koaServer.use(proxy('/wp-content', {
    target: env.wordpress.url,
  }))
}
