'use strict'

// Module imports
const {
  createWriteStream,
  mkdirSync,
} = require('fs')
const { resolve } = require('path')
const moment = require('moment')





module.exports = function (koa) {

  /******************************************************************************\
    Proxy Fuelrats API requests
  \******************************************************************************/

  koa.use(async (ctx, next) => {
    // Make sure the log folder exists
    try {
      mkdirSync(resolve('logs'))
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error
      }
      // It already exists so blep.
    }

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
