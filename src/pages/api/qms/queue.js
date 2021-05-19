import { HttpStatus } from '@fuelrats/web-util/http'
import axios from 'axios'

import { methodRouter } from '~/helpers/apiMiddlewares'





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





async function Queue (req, res) {
  const nowTime = Date.now()

  if (nowTime - cache.count.lastCheck >= cache.count.maxAge) {
    cache.count.lastCheck = nowTime

    const { data, status, statusText } = await axios.get(
      `${process.env.QMS_API_URL}/api/v1/queue/`,
      {
        headers: {
          Authorization: `Bearer ${process.env.QMS_API_TOKEN}`,
        },
      },
    )

    if (status === HttpStatus.OK) {
      const rescueQueue = data.filter((rescue) => {
        return !rescue.pending && !rescue.in_progress
      })

      cache.count.value = rescueQueue.length
    } else {
      console.error('GET /api/v1/queue/', status, statusText, data)
      res.status(status).end(statusText)
      return
    }
  }

  if (nowTime - cache.max.lastCheck >= cache.max.maxAge) {
    cache.max.lastCheck = nowTime
    const { data, status, statusText } = await axios.get(
      `${process.env.QMS_API_URL}/api/v1/config/`,
      {
        headers: {
          Authorization: `Bearer ${process.env.QMS_API_TOKEN}`,
        },
      },
    )

    if (status === HttpStatus.OK) {
      cache.max.value = data.max_active_clients
    } else {
      console.error('GET /api/v1/config/', status, statusText, data)
    }
  }


  res.status(HttpStatus.OK).json({
    data: {
      queueLength: cache.count.value,
      maxClients: cache.max.value,
    },
    meta: {
      queueAge: nowTime - cache.count.lastCheck,
      maxClientAge: nowTime - cache.max.lastCheck,
    },
  })
}



export default methodRouter({
  GET: Queue,
})
