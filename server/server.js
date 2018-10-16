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
const config = require('./config')





// Constants
const IS_DEV = process.env.NODE_ENV !== 'production'
const DEFAULT_PORT = 3000





const server = new Koa()
const nextInstance = next({
  dev: IS_DEV,
  dir: path.resolve('.'),
})





nextInstance.prepare()
  .then(() => {
    // Set up the loggers
    if (IS_DEV) {
      require('./config/file-logger')(server)
    }

    server.use(require('koa-no-trailing-slash')())

    server.use(require('koa-logger')())

    // Configure proxies
    require('./config/proxy')(server, config)

    // Compress responses
    server.use(require('koa-compress')())

    // Parse request bodies
    server.use(require('koa-body')())

    // Configure the router
    require('./config/router')(next, server, config)

    // Start the server
    //  console.log('Listening on port', process.env.PORT || 3000)
    server.listen(process.env.PORT || DEFAULT_PORT)
  })
