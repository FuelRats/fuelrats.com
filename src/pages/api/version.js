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
        branch: $$BUILD.branch ?? 'develop',
        builtOn: $$BUILD.date ?? null,
        builtAt: $$BUILD.url ?? null,
        commit: $$BUILD.commit ?? null,
        versions: {
          app: `v${appVersion}`,
          node: $$BUILD.nodeVersion,
        },
      },
    })
  },
)
