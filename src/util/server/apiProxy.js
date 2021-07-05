import { createProxyMiddleware } from 'http-proxy-middleware'
import * as log from 'next/dist/build/output/log'



function logProvider () {
  return {
    log: log.info,
    debug: log.info,
    info: log.info,
    warn: log.warn,
    error: log.error,
  }
}


export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

export default function apiProxy (options) {
  return createProxyMiddleware({
    changeOrigin: true,
    logLevel: $$BUILD.isDev ? 'debug' : 'warn',
    logProvider,
    secure: true,
    xfwd: true,
    ...options,
  })
}
