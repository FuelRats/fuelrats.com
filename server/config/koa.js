'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const bodyParser = require('koa-bodyparser')
const compress = require('koa-compress')
const logger = require('koa-logger')





module.exports = function (app, config) {

  /******************************************************************************\
    Set up middleware
  \******************************************************************************/

  app.use(logger())
  app.use(compress())
  app.use(bodyParser())
}
