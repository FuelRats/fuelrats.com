'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const proxy = require('koa-proxies')





module.exports = function (koa, config) {

  /******************************************************************************\
    Proxy Fuelrats API requests
  \******************************************************************************/

//  koa.use(proxy('/api', {
//    changeOrigin: true,
////    cookieDomainRewrite: {
////      '*': '.fuelrats.com',
////    },
//    logs: true,
////    preserveReqSession: true,
////    proxyTimeout: 500,
//    rewrite: path => path.replace(/^\/api/, ''),
//    secure: true,
//    target: config.api.url,
//  }))





  /******************************************************************************\
    Proxy EDSM API requests
  \******************************************************************************/

  koa.use(proxy('/edsm-api', {
    changeOrigin: true,
    rewrite: path => path.replace(/^\/edsm-api/, ''),
    target: config.edsm.url,
  }))





  /******************************************************************************\
    Proxy Wordpress requests
  \******************************************************************************/

  koa.use(proxy('/wp-api', {
    auth: `${config.wordpress.username}:${config.wordpress.password}`,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/wp\-api/, '/wp-json/wp/v2'),
    target: config.wordpress.url,
  }))
}
