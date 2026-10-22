import apiProxy from '~/util/server/apiProxy'
import getEnv from '~/util/server/getEnv'





export default apiProxy({
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
