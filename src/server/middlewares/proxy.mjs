// Module imports
import koaProxy from 'koa-proxies'





const stripPathSegment = (segmentName, replaceValue = '/') => {
  return (path) => {
    return path.replace(new RegExp(`\\/${segmentName}\\/`, 'u'), replaceValue)
  }
}


// Default options for all proxies should go here.
const createProxyWithDefaults = (path, opts) => {
  return koaProxy(path, {
    changeOrigin: true,
    secure: true,
    xfwd: true,
    ...opts,
  })
}



const configureProxies = (koaServer, env) => {
  /***************************************************************************\
    Proxy Fuelrats API requests
  \***************************************************************************/

  koaServer.use(createProxyWithDefaults('/api/oauth2/token', {
    auth: `${env.api.clientId}:${env.api.clientSecret}`,
    rewrite: stripPathSegment('api'),
    target: env.api.url,
  }))

  koaServer.use(createProxyWithDefaults('/api', {
    rewrite: stripPathSegment('api'),
    target: env.api.url,
  }))





  /***************************************************************************\
    Proxy EDSM API requests
  \***************************************************************************/

  koaServer.use(createProxyWithDefaults('/edsm-api', {
    rewrite: stripPathSegment('edsm-api'),
    target: env.edsm.url,
  }))





  /***************************************************************************\
    Proxy Wordpress requests
  \***************************************************************************/

  koaServer.use(createProxyWithDefaults('/wp-api', {
    rewrite: stripPathSegment('wp-api', '/wp-json/wp/v2/'),
    target: env.wordpress.url,
  }))

  koaServer.use(createProxyWithDefaults('/wp-content', {
    target: env.wordpress.url,
  }))
}





export default configureProxies
