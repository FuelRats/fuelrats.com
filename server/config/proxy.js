'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const proxy = require('koa-proxies')





module.exports = function (app, config) {

  /******************************************************************************\
    Proxy Fuelrats API requests
  \******************************************************************************/

  app.use(proxy('/api', {
//    changeOrigin: true,
    hostRewrite: false,
    rewrite: path => path.replace(/^\/api/, ''),
    secure: true,
    target: config.api.url,
  }))





  /******************************************************************************\
    Proxy EDSM API requests
  \******************************************************************************/

  app.use(proxy('/edsm-api', {
    changeOrigin: true,
    rewrite: path => path.replace(/^\/edsm-api/, ''),
    target: config.edsm.url,
  }))





  /******************************************************************************\
    Proxy Wordpress requests
  \******************************************************************************/

  app.use(proxy('/wp-api', {
    auth: `${config.wordpress.username}:${config.wordpress.password}`,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/wp\-api/, '/wp-json/wp/v2'),
    target: config.wordpress.url,
  }))
}
