import apiProxy, { config } from './apiProxy'
import getEnv from './getEnv'





export default function frApiProxy (opts = {}) {
  console.log(getEnv()?.frapi?.url)
  return apiProxy({
    target: getEnv()?.frapi?.url,
    pathRewrite: {
      '^/api/fr/': '/',
    },
    ...opts,
  })
}

export { config }
