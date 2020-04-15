// Module imports
import koaProxy from 'koa-proxies'





const stripPathSegment = (segmentName, replaceValue = '/') => {
  return (path) => {
    return path.replace(new RegExp(`\\/${segmentName}\\/`, 'u'), replaceValue)
  }
}





const configureProxies = (koaServer, env) => {
  /***************************************************************************\
    Proxy Fuelrats API requests
  \***************************************************************************/

  koaServer.use(koaProxy('/api/oauth2/token', {
    auth: `${env.api.clientId}:${env.api.clientSecret}`,
    changeOrigin: true,
    jar: true,
    rewrite: stripPathSegment('api'),
    secure: true,
    target: env.api.url,
  }))

  koaServer.use(koaProxy('/api', {
    changeOrigin: true,
    jar: true,
    rewrite: stripPathSegment('api'),
    secure: true,
    target: env.api.url,
  }))





  /***************************************************************************\
    Proxy EDSM API requests
  \***************************************************************************/

  koaServer.use(koaProxy('/edsm-api', {
    changeOrigin: true,
    rewrite: stripPathSegment('edsm-api'),
    target: env.edsm.url,
  }))





  /***************************************************************************\
    Proxy Wordpress requests
  \***************************************************************************/

  koaServer.use(koaProxy('/wp-api', {
    changeOrigin: true,
    rewrite: stripPathSegment('wp-api', '/wp-json/wp/v2/'),
    target: env.wordpress.url,
  }))

  koaServer.use(koaProxy('/wp-content', {
    changeOrigin: true,
    target: env.wordpress.url,
  }))
}





export default configureProxies
