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





// Constants
const server = new Koa()
const app = next({
  dev: env.isDev,
  dir: path.resolve('client'),
})





app.prepare().then(() => {
  // Rewrite URLS to remove trailing slashes
  server.use(require('koa-no-trailing-slash')())

  // Add CSP
  server.use(require('./middlewares/csp')(env.isDev))

  // Compress responses
  server.use(require('koa-compress')())

  // Parse request bodies
  server.use(require('koa-body')())

  // Add proxies
  require('./middlewares/proxy')(server, env)

  // Add routes
  require('./middlewares/router')(app, server)

  // Set up file logger
  if (env.isDev) {
    server.use(require('./middlewares/dev-logger')())
  }

  // Set up console logger
  server.use(require('koa-logger')())

  // Start the server
  server.listen(env.port)
})
