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
const env = require('./config/environment')
const logger = require('./middlewares/logger')
const nextConf = require('./config/next')
const proxy = require('./middlewares/proxy')
const router = require('./middlewares/router')


// Constants
const DEFAULT_PORT = 3000





const server = new Koa()
const app = next({
  dev: env.dev,
  dir: path.resolve('.'),
  conf: nextConf,
})





app.prepare().then(() => {
  // Set up the loggers
  if (env.dev) {
    logger(server)
  }

  server.use(require('koa-no-trailing-slash')())

  server.use(require('koa-logger')())

  // Add proxies
  proxy(server, env)

  // Compress responses
  server.use(require('koa-compress')())

  // Parse request bodies
  server.use(require('koa-body')())

  // Add routes
  router(app, server, env)

  // Start the server
  server.listen(process.env.PORT || DEFAULT_PORT)
})
