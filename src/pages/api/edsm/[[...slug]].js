import httpProxy from 'next-http-proxy-middleware'

import { getEnv } from '~/util/server'



const env = getEnv()

export default function edsmApiProxy (res, req) {
  return httpProxy(req, res, {
    changeOrigin: true,
    secure: true,
    xfwd: true,
    target: env.edsm.url,
    pathRewrite: {
      '^/api/edsm': '',
    },
  })
}
