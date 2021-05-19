import { HttpStatus } from '@fuelrats/web-util/http'
import axios from 'axios'

import { methodRouter } from '~/helpers/apiMiddlewares'


// 10 second maxAge
const cacheMaxAge = 10000

const cache = {
  lastCheck: 0,
  count: 0,
}


async function Queue (req, res) {
  const nowTime = Date.now()

  if (nowTime - cache.lastCheck >= cacheMaxAge) {
    cache.lastCheck = nowTime

    const result = await axios.get(
      `${process.env.QMS_API_URL}/api/v1/queue`,
      {
        headers: {
          Authorization: `Bearer ${process.env.QMS_API_TOKEN}`,
        },
      },
    )

    const rescueQueue = result.data.filter((rescue) => {
      return !rescue.pending && !rescue.in_progress
    })

    cache.count = rescueQueue.length
  }


  return res.status(HttpStatus.OK).json({
    data: {
      queueLength: cache.count,
    },
    meta: {
      age: nowTime - cache.lastCheck,
      maxAge: cacheMaxAge,
    },
  })
}



export default methodRouter({
  GET: Queue,
})
