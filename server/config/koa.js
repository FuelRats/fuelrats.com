'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const bodyParser = require('koa-bodyparser')
const compress = require('koa-compress')
//const logger = require('koa-logger')





module.exports = function (koa, config) {

  /******************************************************************************\
    Set up middleware
  \******************************************************************************/

//  koa.use(logger())
  koa.use(compress())
  koa.use(bodyParser())
}
