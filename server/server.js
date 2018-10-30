/* eslint-env node */
/* eslint-disable strict, global-require */
'use strict'





// Import variables from .env file.
require('dotenv').config()




// Module imports
const Koa = require('koa')
const path = require('path')
const next = require('next')



// Component imports
const env = require('./environment')





const server = new Koa()
const app = next({
  dev: env.isDev,
  dir: path.resolve('client'),
})





app.prepare().then(() => {
  // Set up the loggers
  if (env.isDev) {
    require('./middlewares/logger')(server)
  }

  server.use(require('koa-no-trailing-slash')())

  server.use(require('koa-logger')())

  // Add proxies
  require('./middlewares/proxy')(server, env)

  // Compress responses
  server.use(require('koa-compress')())

  // Parse request bodies
  server.use(require('koa-body')())

  // Add routes
  require('./middlewares/router')(app, server, env)

  // Start the server
  server.listen(env.port)
})
