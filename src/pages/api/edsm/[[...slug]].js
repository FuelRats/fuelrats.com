import apiProxy from '~/util/server/apiProxy'
import getEnv from '~/util/server/getEnv'


const env = getEnv()

export default apiProxy({
  target: env.edsm.url,
  pathRewrite: {
    '^/api/edsm': '',
  },
})
