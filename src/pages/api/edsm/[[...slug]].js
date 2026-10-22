import apiProxy from '~/util/server/apiProxy'
import getEnv from '~/util/server/getEnv'





export default apiProxy({
  target: getEnv()?.edsm?.url,
  pathRewrite: {
    '^/api/edsm/': '/',
  },
})

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}
