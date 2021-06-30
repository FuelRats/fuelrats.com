import apiProxy from '~/util/server/apiProxy'
import getEnv from '~/util/server/getEnv'



const env = getEnv()




export function frApiProxy (opts = {}) {
  return apiProxy({
    target: env.frapi.url,
    pathRewrite: {
      '^/api/fr': '',
    },
    ...opts,
  })
}


export default frApiProxy()
