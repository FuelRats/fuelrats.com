import { HttpStatus } from '@fuelrats/web-util/http'
import UUID from 'pure-uuid'

import apiErrorLocalisations from '~/data/apiErrorLocalisations'

const UUID_VERSION = 4

/**
 * JSONAPI Compliant Error object.
 */
export class APIError extends Error {
  constructor (source, meta) {
    super()
    this.message = this.detail
    this.id = (new UUID(UUID_VERSION)).toString()
    this.source = source
    this.meta = meta
  }

  get code () {
    return HttpStatus[this.status.toUpperCase()]
  }

  get status () {
    return undefined
  }

  get title () {
    return apiErrorLocalisations[this.status].title
  }

  get detail () {
    return apiErrorLocalisations[this.status].detail
  }

  get links () {
    return {
      about: `https://httpstatuses.com/${this.code}`,
    }
  }

  toJSON () {
    return {
      id: this.id,
      links: this.links,
      status: this.status,
      code: this.code,
      title: this.title,
      detail: this.detail,
      source: this.source,
      meta: this.meta,
    }
  }
}



export class UnauthorizedAPIError extends APIError {
  get status () {
    return 'unauthorized'
  }
}

export class TooManyRequestsAPIError extends APIError {
  get status () {
    return 'too_many_requests'
  }

  get detail () {
    const tryAfter = this.meta?.tryAfter
    return `You have sent too many requests in a given amount of time.${tryAfter ? ` Try again after: ${tryAfter}.` : ''}`
  }
}

export class MethodNotAllowedAPIError extends APIError {
  get status () {
    return 'method_not_allowed'
  }
}

export class InternalServerAPIError extends APIError {
  get status () {
    return 'internal_server_error'
  }
}

export class NotImplementedAPIError extends APIError {
  get status () {
    return 'not_implemented'
  }
}
