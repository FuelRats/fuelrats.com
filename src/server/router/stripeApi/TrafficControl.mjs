import { TooManyRequestsError } from './error'

const hourTimer = 60 * 60 * 1000

const allowedUnauthenticatedRequestCount = 3


/**
 * Class for managing the rate of traffic from IP addresses and users
 * @class
 */
class TrafficControl {
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
   * @param {object} arg.connection Koa.js context object.
   * @param {boolean} arg.increase Whether this validation should also increase the request count by 1
   * @returns {object} An object containing whether the rate limit is exceeded, how many requests are left,
   * and the total requests
   */
  validateRateLimit ({ connection, increase = true }) {
    const fingerprint = connection.request.get('X-Fingerprint')
    let entity = null
    let valid = false

    if (fingerprint) {
      entity = this.retrieveUnauthenticatedEntity({ remoteAddress: connection.ip, fingerprint })
      valid = entity.remainingRequests > 0
      if (valid && increase) {
        entity.count += 1
      }
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
   * @param {string} remoteAddress - The remote address associated with this request
   * @returns {object} an instance of RemoteAddressEntity
   */
  retrieveUnauthenticatedEntity ({ remoteAddress, fingerprint }) {
    let entity = this.unauthenticatedRequests[remoteAddress] || this.unauthenticatedRequests[fingerprint]
    if (!entity) {
      entity = new RemoteAddressEntity({ remoteAddress, fingerprint })
      this.unauthenticatedRequests[remoteAddress] = entity
      this.unauthenticatedRequests[fingerprint] = entity
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
   * @param {string} arg.remoteAddress The remote address this traffic belongs to
   * @param {string} arg.fingerprint The fingerprint provided by the
   * @param {number} [arg.initialCount] Optional parameter containing the number of requests this entity should start
   */
  constructor ({ remoteAddress, fingerprint, initialCount = 0 }) {
    this.#remoteAddress = remoteAddress
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



const createControlTower = () => {
  const traffic = new TrafficControl()

  return async function trafficControl (ctx, next) {
    const rateLimit = traffic.validateRateLimit({ connection: ctx })
    ctx.state.traffic = rateLimit
    ctx.set('X-Rate-Limit-Limit', rateLimit.total)
    ctx.set('X-Rate-Limit-Remaining', rateLimit.remaining)
    ctx.set('X-Rate-Limit-Reset', rateLimit.reset)


    if (rateLimit.exceeded) {
      throw new TooManyRequestsError()
    }

    await next()
  }
}

export default createControlTower
