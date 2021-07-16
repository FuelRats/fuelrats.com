import { HttpStatus } from '@fuelrats/web-util/http'
import compose from 'koa-compose'

import JsonApiContext from './JsonApiContext'


const jsonApiContentType = 'application/vnd.api+json'





function checkSent ({ res, __suppressWarnings }) {
  const sent = res.finished || res.headersSent || res.writableEnded
  if (sent && !__suppressWarnings) {
    console.error('JSON:API route manually sent response. This is NOT supported by this middleware.')
  }

  return sent
}

export default function jsonApiRoute (...middleware) {
  const handler = compose(middleware)

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
