import httpProxy from 'next-http-proxy-middleware'

import { getEnv } from '~/util/server'



const env = getEnv()

export default function wpApiProxy (res, req) {
  return httpProxy(req, res, {
    changeOrigin: true,
    secure: true,
    xfwd: true,
    target: env.wordpress.url,
    pathRewrite: {
      '^/api/wp': '/wp-json/wp/v2',
    },
  })
}
