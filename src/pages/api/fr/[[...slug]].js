import httpProxy from 'next-http-proxy-middleware'

import { getEnv } from '~/util/server'



const env = getEnv()


export function frApiProxy (opts = {}) {
  return (req, res) => {
    return httpProxy(req, res, {
      changeOrigin: true,
      secure: true,
      xfwd: true,
      target: env.frapi.url,
      ...opts,
      pathRewrite: {
        '^/api/fr': '',
        ...(opts.pathRewrite ?? {}),
      },
    })
  }
}


export default frApiProxy()
