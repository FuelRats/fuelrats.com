import { NextApiRequest, NextApiResponse } from 'next'

import bindMethod from '~/util/decorators/bindMethod'
import createResource from '~/util/jsonapi/createResource'
import { InternalServerAPIError, APIError } from '~/util/server/errors'
import getEnv from '~/util/server/getEnv'



const env = getEnv()


function modRequest (req) {
  // Add IP handlers
  Reflect.defineProperty(req, 'ips', {
    get: () => {
      const fwdForIps = req.headers['x-forwarded-for']
      return env.proxied && fwdForIps
        ? fwdForIps.split(/\s*,\s*/u)
        : []
    },
  })

  Reflect.defineProperty(req, 'ip', {
    get: () => {
      return req.ips[0] ?? req.socket.remoteAddress ?? ''
    },
  })

  Reflect.defineProperty(req, 'fingerprint', {
    get: () => {
      return req.headers['x-fingerprint']
    },
  })

  Reflect.defineProperty(req, 'getHeader', {
    value: (headerName) => {
      return req.headers[headerName.toLowerCase()]
    },
  })

  return req
}

/**
 * Context object for JsonApiRoute endpoints
 */
export default class JsonApiContext {
  req = null
  res = null
  state = {}
  meta = {}
  __suppressWarnings = false

  #resData = null
  #resIncluded = []
  #resErrors = []

  /**
   * @param {NextApiRequest} req
   * @param {NextApiResponse} res
   */
  constructor (req, res) {
    this.req = modRequest(req)
    this.res = res
    this.createResource = createResource.bind(null, null)
  }

  /**
   * @param {object} data
   * @returns {JsonApiContext}
   */
  @bindMethod
  send (data) {
    if (Array.isArray(data)) {
      this.#resData = data.map(createResource.bind(null, data[0]?.type))
    } else {
      this.#resData = createResource(null, data)
    }

    return this
  }

  /**
   * @param {APIError} error
   * @param {boolean} first
   * @returns {JsonApiContext}
   */
  @bindMethod
  error (error, first) {
    if (error) {
      this.#resErrors[first ? 'unshift' : 'push'](
        error instanceof APIError
          ? error
          : new InternalServerAPIError(null, {
            internalError: {
              name: error.name,
              message: error.message,
            },
          }),
      )
    }

    return this
  }

  /**
   * @param {number} statusCode
   * @returns {JsonApiContext}
   */
  @bindMethod
  status (statusCode) {
    this.res.status(statusCode)
    return this
  }

  /**
   * @param {object | object[]} data
   * @returns {JsonApiContext}
   */
  @bindMethod
  include (data) {
    if (Array.isArray(data)) {
      this.#resIncluded.push(...data.map(this.createResource))
    } else {
      this.#resIncluded.push(createResource(null, data))
    }
    return this
  }


  /**
   * @returns {object}
   */
  @bindMethod
  toJSON () {
    const errors = this.#resErrors

    return {
      data: errors.length ? undefined : this.#resData,
      included: errors.length ? undefined : this.#resIncluded,
      errors: errors.length ? errors : undefined,
      meta: this.meta,
      jsonapi: {
        version: '1.0',
      },
    }
  }

  /**
   * @returns {any}
   */
  get data () {
    return this.#resData
  }

  set data (newData) {
    this.send(newData)
  }

  /**
   * @returns {object[]}
   */
  get included () {
    return this.#resIncluded
  }

  /**
   * @returns {APIError[]}
   */
  get errors () {
    return this.#resErrors
  }
}
