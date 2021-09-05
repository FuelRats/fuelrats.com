import acceptMethod from '~/util/server/middleware/acceptMethod'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'

const maxAge = 21600000 // 6 hours

export function listLocaleFiles (ctx) {
  return ctx.fetch({
    url: 'https://api.github.com/repos/fuelrats/QMS/contents/qms/frontend/public/locales/en?ref=main',
    cache: {
      key: 'qms-locale-list',
      maxAge,
    },
  }).then(({ data }) => {
    return data.map((fileMeta) => {
      return {
        id: fileMeta.name,
        type: 'locale-files',
        links: {
          self: fileMeta.url,
          related: fileMeta.download_url,
        },
      }
    })
  })
}

export default jsonApiRoute(
  acceptMethod.GET(),
  async (ctx) => {
    ctx.send(await listLocaleFiles(ctx))
  },
)
