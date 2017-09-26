'use strict'

// Module imports
const { createWriteStream } = require('fs')
const moment = require('moment')





module.exports = function (koa) {

  /******************************************************************************\
    Proxy Fuelrats API requests
  \******************************************************************************/

  koa.use(async (ctx, next) => {
    let writeStream = createWriteStream(`./logs/${moment().format('YYYY-MM-DD')}.log`, { flags: 'a' })

    let log = {
      req: {
        headers: ctx.request.headers,
        href: ctx.request.href,
        method: ctx.request.method,
        query: ctx.request.query,
        url: ctx.request.url,
      },
      startedAt: Date.now(),
    }

    await next()

    let finishedAt = Date.now()

    Object.assign(log, {
      duration: finishedAt - log.startedAt,
      res: {
        body: ctx.response.body,
        headers: ctx.response.headers,
        status: ctx.response.status,
      },
      finishedAt,
    })

    writeStream.write(`data: ${JSON.stringify(log)}\n\n`)
    writeStream.end()
  })
}
