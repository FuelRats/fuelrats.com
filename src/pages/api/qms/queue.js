import { HttpStatus } from '@fuelrats/web-util/http'
import axios from 'axios'

import { InternalServerAPIError } from '~/util/server/errors'
import getEnv from '~/util/server/getEnv'
import acceptMethod from '~/util/server/middleware/acceptMethod'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'




// Module constants
const cache = {
  count: {
    maxAge: 10000,
    lastCheck: 0,
    value: 0,
  },
  max: {
    maxAge: 60000,
    lastCheck: 0,
    value: 0,
  },
}
const env = getEnv()




export default jsonApiRoute(
  acceptMethod.GET(),
  async (ctx) => {
    const nowTime = Date.now()

    if (nowTime - cache.count.lastCheck >= cache.count.maxAge) {
      cache.count.lastCheck = nowTime

      const { data, status, statusText } = await axios.get(
        `${env.qms.url}/api/v1/queue/`,
        {
          headers: {
            Authorization: `Bearer ${env.qms.token}`,
          },
        },
      )

      if (status === HttpStatus.OK) {
        const rescueQueue = data.filter((rescue) => {
          return !rescue.pending && !rescue.in_progress
        })

        cache.count.value = rescueQueue.length
      } else {
        ctx.error(new InternalServerAPIError({
          meta: {
            internalError: {
              url: '/api/v1/queue/',
              status,
              statusText,
            },
          },
        }))
      }
    }

    if (nowTime - cache.max.lastCheck >= cache.max.maxAge) {
      cache.max.lastCheck = nowTime
      const { data, status, statusText } = await axios.get(
        `${env.qms.url}/api/v1/config/`,
        {
          headers: {
            Authorization: `Bearer ${env.qms.token}`,
          },
        },
      )

      if (status === HttpStatus.OK) {
        cache.max.value = data.max_active_clients
      } else {
        ctx.error(new InternalServerAPIError({
          meta: {
            internalError: {
              url: '/api/v1/config/',
              status,
              statusText,
            },
          },
        }))
      }
    }


    ctx.send({
      id: 'static',
      type: 'queue-statistics',
      attributes: {
        queueLength: cache.count.value,
        maxClients: cache.max.value,
      },
      meta: {
        queueAge: nowTime - cache.count.lastCheck,
        maxClientAge: nowTime - cache.max.lastCheck,
      },
    })
  },
)
