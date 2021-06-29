import { HttpStatus } from '@fuelrats/web-util/http'

/**
 * JSONAPI Compliant Error object.
 */
export class JSONApiError extends Error {
  constructor (conf) {
    const {
      message,
      code,
      meta,
      status,
      source,
      title,
    } = conf

    super(message)
    this.code = code
    this.meta = meta
    this.source = source
    this.status = status
    this.title = title
  }

  toJSON () {
    return {
      status: this.status ?? 'internal_server_error',
      code: this.code ?? HttpStatus.INTERNAL_SERVER_ERROR,
      title: this.title ?? 'Internal Server Error',
      detail: this.message,
      source: this.source,
      meta: this.meta,
    }
  }
}

export class UnauthorizedApiError extends JSONApiError {
  constructor ({ message, ...restErr } = {}) {
    super({
      ...restErr,
      status: 'unauthorized',
      code: HttpStatus.UNAUTHORIZED,
      title: 'Unauthorized',
      message: message ?? 'You lack valid authentication credentials for this action.',
    })
  }
}

export class TooManyRequestsApiError extends JSONApiError {
  constructor ({ message, tryAfter, meta, ...restErr } = {}) {
    super({
      ...restErr,
      status: 'too_many_requests',
      code: HttpStatus.TOO_MANY_REQUESTS,
      title: 'Too Many Requests',
      message: message ?? `You have sent too many requests in a given amount of time.${tryAfter ? ` Try again after: ${tryAfter}.` : ''}`,
      meta: {
        ...(meta ?? {}),
        tryAfter: tryAfter ?? 0,
      },
    })
  }
}

export class InternalServerApiError extends JSONApiError {
  constructor ({ message, internalError, meta } = {}) {
    super({
      status: 'internal_server_error',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      title: 'Internal Server Error',
      message: message ?? 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
      meta: internalError
        ? {
          ...(meta ?? {}),
          internalError: {
            message: internalError.message,
            name: internalError.name,
          },
        }
        : meta,
    })
  }
}
