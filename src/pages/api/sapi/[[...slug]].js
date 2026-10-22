import getEnv from '~/util/server/getEnv'
import thirdPartyProxy from '~/util/server/thirdPartyProxy'





export default thirdPartyProxy({
  target: getEnv()?.sapi?.url,
  pathRewrite: {
    '^/api/sapi/': '/',
  },
})

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}
