'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

const config = require('./config')





/******************************************************************************\
  Initialize the app
\******************************************************************************/

// Start Koa
const app = new (require('koa'))
app.next = require('next')({
  dev: process.env.NODE_ENV !== 'production'
})

app.next.prepare()
.then(() => {
  // Configure proxies
  require('./config/proxy')(app, config)

  // Configure middleware, et al
  require('./config/koa')(app, config)

  // Configure static file serving
  require('./config/serve')(app, config)

  // Configure the router
  require('./config/router')(app, config)

  // Start the server
//  console.log('Listening on port', process.env.PORT || 3000)
  app.listen(process.env.PORT || 3000)
})





/******************************************************************************\
  Start the server
\******************************************************************************/

//console.log('Listening on port', process.env.PORT || 3000)
//app.listen(process.env.PORT || 3000)
