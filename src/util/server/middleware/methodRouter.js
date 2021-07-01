import { MethodNotAllowedAPIError } from '../errors'


/**
 *
 * @param {string[]} allowedMethods list of allowed request methods.
 * @returns {Function}
 */
function limitMethod (allowedMethods) {
  return (ctx, next) => {
    const reqMethod = ctx.req.method.toUpperCase()

    if (!allowedMethods.includes(reqMethod)) {
      throw new MethodNotAllowedAPIError({
        meta: {
          allowedMethods,
        },
      })
    }

    return next()
  }
}


/**
 *
 * @param {object} methodHandlers
 * @param {Function?} methodHandlers.GET
 * @param {Function?} methodHandlers.POST
 * @param {Function?} methodHandlers.PUT
 * @param {Function?} methodHandlers.PATCH
 * @param {Function?} methodHandlers.DELETE
 * @returns {Function}
 */
function methodRouter (methodHandlers) {
  const allowedMethods = Object.keys(methodHandlers).map((name) => {
    return name.toUpperCase()
  })

  return (ctx, next) => {
    const reqMethod = ctx.req.method.toUpperCase()

    let handler = methodHandlers[reqMethod]
    handler ??= reqMethod === 'PATCH' && methodHandlers.PUT // Try PUT if PATCH isn't defined

    if (!handler) {
      ctx.res.setHeader('Allow', allowedMethods)
      throw new MethodNotAllowedAPIError({
        meta: {
          allowedMethods,
        },
      })
    }

    return handler(ctx, next)
  }
}

methodRouter.GET = limitMethod.bind(null, ['GET'])
methodRouter.POST = limitMethod.bind(null, ['POST'])
methodRouter.PUT = limitMethod.bind(null, ['PUT', 'PATCH'])
methodRouter.PATCH = limitMethod.bind(null, ['PATCH'])
methodRouter.DELETE = limitMethod.bind(null, ['DELETE'])





export default methodRouter
export {
  limitMethod,
}
