import { config } from '~/util/server/apiProxy'
import getEnv from '~/util/server/getEnv'
import thirdPartyProxy from '~/util/server/thirdPartyProxy'





export default thirdPartyProxy({
  target: getEnv()?.wordpress?.url,
  pathRewrite: {
    '^/api/wp/': '/wp-json/wp/v2/',
  },
})

export { config }
