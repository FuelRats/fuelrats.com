import { listLocaleFiles } from '~/pages/api/qms/locales'
import { NotFoundAPIError } from '~/util/server/errors'
import acceptMethod from '~/util/server/middleware/acceptMethod'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'

const maxAge = 21600000 // 6 hours

export function getLocaleData (ctx, localeMeta) {
  return ctx.fetch({
    url: localeMeta.links.related,
    cache: {
      key: `qms-locale-data-${localeMeta.id}`,
      maxAge,
    },
  }).then(({ data }) => {
    return data
  })
}

export default jsonApiRoute(
  acceptMethod.GET(),
  async (ctx) => {
    const localeMeta = (await listLocaleFiles(ctx)).find((data) => {
      return data.id === ctx.req.query.id
    })
    if (!localeMeta) {
      throw new NotFoundAPIError({ parameter: 'id' })
    }

    ctx.send({
      id: localeMeta.id,
      type: 'locale-data',
      attributes: {
        data: await getLocaleData(ctx, localeMeta),
      },
      meta: {
        github: {
          meta: localeMeta.links.self,
          raw: localeMeta.links.related,
          html: localeMeta.meta.html,
        },
      },
    })
  },
)
