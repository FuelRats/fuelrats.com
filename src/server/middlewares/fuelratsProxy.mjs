import koaProxy from 'koa-proxies'





const stripPathSegment = (segmentName, replaceValue = '/') => {
  return (path) => {
    return path.replace(new RegExp(`${segmentName}\\/`, 'u'), replaceValue)
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



const fuelratsProxy = (koaServer, env) => {
  /***************************************************************************\
    Proxy Fuelrats API requests
  \***************************************************************************/

  const frApiPath = '/api/fr'

  koaServer.use(createProxyWithDefaults(`${frApiPath}/oauth2/token`, {
    auth: `${env.api.clientId}:${env.api.clientSecret}`,
    rewrite: stripPathSegment(frApiPath),
    target: env.api.url,
  }))

  koaServer.use(createProxyWithDefaults(`${frApiPath}/oauth2/revoke`, {
    auth: `${env.api.clientId}:${env.api.clientSecret}`,
    rewrite: stripPathSegment(frApiPath),
    target: env.api.url,
  }))

  koaServer.use(createProxyWithDefaults(frApiPath, {
    rewrite: stripPathSegment(frApiPath),
    target: env.api.url,
  }))





  /***************************************************************************\
    Proxy EDSM API requests
  \***************************************************************************/

  const edsmApiPath = '/api/edsm'

  koaServer.use(createProxyWithDefaults(edsmApiPath, {
    rewrite: stripPathSegment(edsmApiPath),
    target: env.edsm.url,
  }))





  /***************************************************************************\
    Proxy Wordpress requests
  \***************************************************************************/

  const wpApiPath = '/api/wp'

  koaServer.use(createProxyWithDefaults(wpApiPath, {
    rewrite: stripPathSegment(wpApiPath, '/wp-json/wp/v2/'),
    target: env.wordpress.url,
  }))

  koaServer.use(createProxyWithDefaults('/wp-content', {
    target: env.wordpress.url,
  }))
}





export default fuelratsProxy
