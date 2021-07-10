import { TooManyRequestsAPIError } from '~/util/server/errors'

const hourTimer = 60 * 60 * 1000

const allowedUnauthenticatedRequestCount = 3


/**
 * Class for managing the rate of traffic from IP addresses and users
 * @class
 */
class TrafficControl {
  unauthenticatedRequests = {}
  #resetTimer = 0

  /**
   * Create a new instance of a Traffic Controller with fresh hash tables and reset clock
   */
  constructor () {
    this.reset()
  }

  /**
   *
   * @param {object} arg function arguments object
   * @param {object} arg.ctx jsonApiRoute context object.
   * @param {boolean} arg.increase Whether this validation should also increase the request count by 1
   * @returns {object} An object containing whether the rate limit is exceeded, how many requests are left,
   * and the total requests
   */
  validateRateLimit ({ ctx, increase = true }) {
    const entity = this.retrieveRateLimitedEntity(ctx.req)
    const valid = entity.remainingRequests > 0
    if (valid && increase) {
      entity.count += 1
    }

    return {
      exceeded: !valid,
      remaining: entity?.remainingRequests ?? 0,
      total: entity?.totalRequests ?? allowedUnauthenticatedRequestCount,
      reset: this.nextResetDate,
    }
  }

  /**
   * Retrieve an unauthenticated entity with the number of requests made by this IP address, or create one
   * @param {object} arg Function argument object
   * @param {string} arg.ip The remote address associated with this request
   * @param {string} arg.fingerprint The client fingerprint associated with this request
   * @returns {object} an instance of RemoteAddressEntity
   */
  retrieveRateLimitedEntity ({ ip, fingerprint }) {
    let entity = (fingerprint && this.unauthenticatedRequests[fingerprint]) ?? this.unauthenticatedRequests[ip]

    if (!entity) {
      entity = new RemoteAddressEntity({ ip, fingerprint })
      this.unauthenticatedRequests[ip] = entity

      if (fingerprint) {
        this.unauthenticatedRequests[fingerprint] = entity
      }
    }

    return entity
  }

  /**
   * Get the next time all rate limits will be reset (The next full hour)
   * @returns {Date} A date object containing the next time all rate limits will be reset
   */
  get nextResetDate () {
    return new Date(Math.ceil(new Date().getTime() / hourTimer) * hourTimer)
  }

  /**
   * Get the remaining milliseconds until the next time all rate limits will be reset (the next full hour)
   * @returns {number} A number with the number of milliseconds until the next rate limit reset
   * @private
   */
  get remainingTimeToNextResetDate () {
    return this.nextResetDate.getTime() - new Date().getTime()
  }

  /**
   * Reset all rate limits
   * @private
   */
  reset () {
    this.unauthenticatedRequests = {}
    this.#resetTimer = setTimeout(this.reset.bind(this), this.remainingTimeToNextResetDate)
  }
}

/**
 * Class representing an unauthenticated remote address containing their requests the last clock hour
 */
class RemoteAddressEntity {
  #remoteAddress = undefined
  #fingerprint = undefined

  /**
   * Create an entity representing the traffic made by a specific unauthenticated remote address
   * @param {object} arg function arguments object
   * @param {string} arg.ip The remote address this entity belongs to
   * @param {string} arg.fingerprint The browser fingerprint this entity belongs to
   * @param {number} [arg.initialCount] Optional parameter containing the number of requests this entity should start
   */
  constructor ({ ip, fingerprint, initialCount = 0 }) {
    this.#remoteAddress = ip
    this.#fingerprint = fingerprint
    this.requestCount = initialCount
  }

  /**
   * Get the number of remaining requests this entity has in this period
   * @returns {number} the number of remaining requests this entity has in this period
   */
  get remainingRequests () {
    return allowedUnauthenticatedRequestCount - this.requestCount
  }

  /**
   * Get the total number of requests
   * @returns {number} total number of requests
   */
  get totalRequests () {
    return allowedUnauthenticatedRequestCount
  }

  /**
   * Get the number of requests made by this entity during the rate limit period
   * @returns {number} number of requests made by this entity during the rate limit period
   */
  get count () {
    return this.requestCount
  }

  /**
   * Set the number of requests made by this entity during the rate limit period
   * @param {number} count The number of requests made by this entity during the rate limit period
   */
  set count (count) {
    this.requestCount = count
  }
}



const trafficController = () => {
  const traffic = new TrafficControl()

  return async function rateLimitMiddleware (ctx, next) {
    const user = traffic.validateRateLimit({ ctx })
    // Set to state for reference.
    ctx.state.traffic = user

    // Set to outgoing headers.
    ctx.res.setHeader('X-Rate-Limit-Limit', user.total)
    ctx.res.setHeader('X-Rate-Limit-Remaining', user.remaining)
    ctx.res.setHeader('X-Rate-Limit-Reset', user.reset)

    // Set to response meta.
    ctx.meta.rateLimitTotal = user.total
    ctx.meta.rateLimitRemaining = user.remaining
    ctx.meta.rateLimitReset = user.reset

    if (user.exceeded) {
      throw new TooManyRequestsAPIError(null, {
        tryAfter: user.reset,
      })
    }

    await next()
  }
}

export default trafficController
