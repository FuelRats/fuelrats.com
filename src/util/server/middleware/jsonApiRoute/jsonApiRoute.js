import { HttpStatus } from '@fuelrats/web-util/http'
import compose from 'koa-compose'

import getEnv from '../../getEnv'
import JsonApiContext from './JsonApiContext'


const jsonApiContentType = 'application/vnd.api+json'
const env = getEnv()

function checkSent ({ res, __suppressWarnings }) {
  const sent = res.finished || res.headersSent || res.writableEnded
  if (sent && !__suppressWarnings) {
    console.error('JSON:API route manually sent response. This is NOT supported by this middleware.')
  }

  return sent
}

function getIps ({ req }) {
  const ips = req.headers['X-Forwarded-For']
  return env.proxied && ips
    ? ips.split(/\s*,\s*/u)
    : []
}


function modRequest (ctx, next) {
  // Add IP handlers
  ctx.req.ips = getIps(ctx)
  ctx.req.ip = ctx.req.ips[0] ?? ctx.req.socket.remoteAddress ?? ''

  return next()
}


export default function jsonApiRoute (...middleware) {
  const handler = compose([
    modRequest,
    ...middleware,
  ])

  return async (req, res) => {
    const ctx = new JsonApiContext(req, res)

    try {
      await handler(ctx)

      if (!ctx.data && !ctx.errors.length) {
        throw new Error('Route failed to respond with data or error.')
      }
    } catch (error) {
      ctx.error(error, true)
    }

    if (checkSent(ctx)) {
      return
    }

    res.status(ctx.errors[0]?.code ?? res.statusCode ?? HttpStatus.OK)
    res.setHeader('Content-Type', jsonApiContentType)
    res.send(JSON.stringify(ctx)) // Body must be stringified here, or Next will override Content-Type
  }
}
