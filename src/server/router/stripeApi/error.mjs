import HttpStatus from '../../../helpers/HttpStatus'

export class ApiError extends Error {
  constructor ({ message, code, status, ...source }) {
    super(message)
    this.statusCode = code
    this.status = status
    this.source = source
  }

  toJSON () {
    return {
      status: this.status ?? 'internal_server_error',
      code: this.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      source: {
        ...this.source,
        message: this.message,
      },
    }
  }
}

export class UnauthorizedError extends ApiError {
  constructor (message) {
    super(
      message ?? 'The request has not been applied because it lacks valid authentication credentials for the target resource.',
      HttpStatus.UNAUTHORIZED,
      'unauthorized',
    )
  }
}

export class TooManyRequestsError extends ApiError {
  constructor (message, retryAfter) {
    super({
      message: message ?? 'The user has sent too many requests in a given amount of time',
      status: 'too_many_requests',
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      retryAfter,
    })
  }
}

export class InternalServerError extends ApiError {
  constructor (message, internalError) {
    super({
      message: message ?? 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
      status: 'internal_server_error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      internalError: internalError
        ? {
          message: internalError.message,
          name: internalError.name,
        }
        : undefined,
    })
  }
}
