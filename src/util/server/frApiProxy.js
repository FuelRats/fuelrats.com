import apiProxy, { config } from './apiProxy'
import getEnv from './getEnv'





const PROXY_TIMEOUT_MS = 60000

export default function frApiProxy (opts = {}) {
  return apiProxy({
    target: getEnv()?.frapi?.url,
    pathRewrite: {
      '^/api/fr/': '/',
    },
    proxyTimeout: PROXY_TIMEOUT_MS,
    timeout: PROXY_TIMEOUT_MS,
    ...opts,
  })
}

export { config }
