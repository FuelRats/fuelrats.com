import { config } from '~/util/server/apiProxy'
import getEnv from '~/util/server/getEnv'
import thirdPartyProxy from '~/util/server/thirdPartyProxy'





export default thirdPartyProxy({
  target: getEnv()?.sapi?.url,
  pathRewrite: {
    '^/api/sapi/': '/',
  },
})

export { config }
