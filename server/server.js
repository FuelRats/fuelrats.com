'use strict'

let isDev = process.env.NODE_ENV !== 'production'

/******************************************************************************\
  Module imports
\******************************************************************************/

const config = require('./config')
const koa = new (require('koa'))
const path = require('path')

const next = require('next')({
  dev: isDev,
  dir: path.resolve('.')
})





/******************************************************************************\
  Initialize the app
\******************************************************************************/

next.prepare()
.then(() => {
  // Set up the loggers
  if (isDev) {
    require('./config/file-logger')(koa)
  }

  koa.use(require('koa-logger')())

  // Configure proxies
  require('./config/proxy')(koa, config)

  // Compress responses
  koa.use(require('koa-compress')())

  // Parse request bodies
  koa.use(require('koa-body')())

  // Configure the router
  require('./config/router')(next, koa, config)

  // Start the server
//  console.log('Listening on port', process.env.PORT || 3000)
  koa.listen(process.env.PORT || 3000)
})
