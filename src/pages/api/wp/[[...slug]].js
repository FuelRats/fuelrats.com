import apiProxy from '~/util/server/apiProxy'
import getEnv from '~/util/server/getEnv'

const env = getEnv()

export default apiProxy({
  target: env.wordpress.url,
  pathRewrite: {
    '^/api/wp': '/wp-json/wp/v2',
  },
})
