import getEnv from '~/util/server/getEnv'
import thirdPartyProxy from '~/util/server/thirdPartyProxy'





// Serves /wp-content/* (rewritten here in .config/rewrites.config.js) from the WordPress host.
export default thirdPartyProxy({
  target: getEnv()?.wordpress?.url,
  pathRewrite: {
    '^/api/wp-content/': '/wp-content/',
  },
})

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}
