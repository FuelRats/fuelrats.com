import acceptMethod from '~/util/server/middleware/acceptMethod'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'

import pkgFile from '../../../package.json'

const { version: appVersion } = pkgFile




export default jsonApiRoute(
  acceptMethod.GET(),
  (ctx) => {
    ctx.send({
      id: $$BUILD.id,
      type: 'fr-web-builds',
      attributes: {
        branch: $$BUILD.branch,
        builtAt: $$BUILD.date,
        buildUrl: $$BUILD.url,
        commit: $$BUILD.commit,
        versions: {
          app: `v${appVersion}`,
          node: $$BUILD.nodeVersion,
        },
      },
    })
  },
)
