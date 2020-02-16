// Module imports
const findRemoveSync = require('find-remove')
const { createWriteStream, mkdirSync } = require('fs')
const moment = require('moment')
const { resolve } = require('path')





module.exports = () => {
  // Module loaded so lets setup the logs dir and clear it out of any old stuff.

  // Make sure the log folder exists
  try {
    mkdirSync(resolve('logs'))
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error
    }
    // It already exists so lets see if we can clean up a little first.
    findRemoveSync(resolve('logs'), {
      age: { seconds: 259200 }, // 3 days
      extensions: ['.log'],
    })
  }

  // Return our middleware.
  return async (ctx, next) => {
    const writeStream = createWriteStream(`./logs/${moment().format('YYYY-MM-DD')}.log`, { flags: 'a' })

    const log = {
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

    const finishedAt = Date.now()

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
  }
}
