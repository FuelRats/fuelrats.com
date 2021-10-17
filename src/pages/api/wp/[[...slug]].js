import apiProxy, { config } from '~/util/server/apiProxy'
import getEnv from '~/util/server/getEnv'





export default apiProxy({
  target: getEnv()?.wordpress?.url,
  pathRewrite: {
    '^/api/wp/': '/wp-json/wp/v2/',
  },
})

export { config }
