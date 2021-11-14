import acceptMethod from '~/util/server/middleware/acceptMethod'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'

const maxAge = 21600000 // 6 hours
const repo = 'fuelrats/QMS'
const path = 'qms/frontend/public/locales/en'
const branch = 'develop'

export function listLocaleFiles (ctx) {
  return ctx.fetch({
    url: `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
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
        meta: {
          html: fileMeta.html_url,
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
