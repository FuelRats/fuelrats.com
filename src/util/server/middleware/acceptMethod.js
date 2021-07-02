import { HttpStatus, HttpMethod } from '@fuelrats/web-util/http'

import { MethodNotAllowedAPIError } from '../errors'





/**
 * @param {...string} methods allowed request methods.
 * @returns {Function}
 */
function acceptMethod (...methods) {
  const allowedMethods = [HttpMethod.OPTIONS, ...methods]

  return (ctx, next) => {
    const reqMethod = ctx.req.method.toUpperCase()

    if (reqMethod === HttpMethod.OPTIONS) {
      ctx.__suppressWarnings = true
      ctx.res.setHeader('Allow', allowedMethods.join(', '))
      ctx.res.status(HttpStatus.OK)
      ctx.res.end('')
      return undefined
    }

    if (!allowedMethods.includes(reqMethod)) {
      ctx.res.setHeader('Allow', allowedMethods.join(', '))
      throw new MethodNotAllowedAPIError({
        meta: {
          allowedMethods,
        },
      })
    }

    return next()
  }
}

acceptMethod.GET = acceptMethod.bind(null, HttpMethod.GET)
acceptMethod.POST = acceptMethod.bind(null, HttpMethod.POST)
acceptMethod.PUT = acceptMethod.bind(null, HttpMethod.PUT)
acceptMethod.PATCH = acceptMethod.bind(null, HttpMethod.PATCH)
acceptMethod.DELETE = acceptMethod.bind(null, HttpMethod.DELETE)





export default acceptMethod
