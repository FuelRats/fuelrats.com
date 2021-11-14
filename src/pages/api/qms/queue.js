import getEnv from '~/util/server/getEnv'
import acceptMethod from '~/util/server/middleware/acceptMethod'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'




// Module constants
const env = getEnv()

function getQueueLength (ctx) {
  return ctx.fetch({
    url: `${env.qms.url}/api/v1/queue/`,
    headers: {
      Authorization: `Bearer ${env.qms.token}`,
    },
    cache: {
      key: 'qms-queue-count',
      maxAge: 10000,
    },
  }).then(
    ({ data }) => {
      return data.filter((rescue) => {
        return !rescue.pending && !rescue.in_progress
      }).length
    },
  )
}

function getMaxQueueLength (ctx) {
  return ctx.fetch({
    url: `${env.qms.url}/api/v1/config/`,
    headers: {
      Authorization: `Bearer ${env.qms.token}`,
    },
    cache: {
      key: 'qms-queue-max-count',
      maxAge: 60000,
    },
  }).then(
    ({ data }) => {
      return data.max_active_clients
    },
  )
}


export default jsonApiRoute(
  acceptMethod.GET(),
  async (ctx) => {
    ctx.send({
      id: 'static',
      type: 'queue-statistics',
      attributes: {
        queueLength: await getQueueLength(ctx),
        maxClients: await getMaxQueueLength(ctx),
      },
    })
  },
)
