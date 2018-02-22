
export class StoreError {
  constructor(message, source) {
    this.message = message
    this.source = source
  }
}


export class ApiError extends StoreError {
  constructor(errorObj, action) {
    if (!errorObj || !errorObj.errors || !Array.isArray(errorObj.errors)) {
      super('Unknown API Error.', action)
      this.errors = [
        {
          id: '????????-????-????-????-????????????',
          links: {
            about: 'https://httpstatuses.com/internal_server',
          },
          status: 500,
          code: 'internal_server',
          title: 'Internal Server Error',
          detail: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
          source: {},
        },
      ]
    } else {
      const {
        errors,
      } = errorObj

      const errMessage = `${errors[0].detail}${errors.length > 1 ? ` [+${errors.length - 1} more...]` : ''}`
      super(errMessage, action)


      const pointers = []

      for (const error of errors) {
        if (error.source) {
          if (error.source.pointer) {
            pointers.push(error.source.pointer)
          }

          if (error.source.parameter) {
            pointers.unshift(error.source.parameter)
          }
        }
      }
      this.errors = errors;
      [this.primaryError] = this.errors
      this.internalError = errorObj
      this.invalidFields = pointers
    }
    this.isApiError = {}
  }
}
