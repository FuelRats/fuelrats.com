/* eslint-disable no-magic-numbers */// Not even gonna bother defining consts when it's clear what the numbers here are for.


class HttpStatusText {
  // Informational
  static 100 = 'Continue'
  static 101 = 'Switching Protocols'
  static 102 = 'Processing'


  //  Success
  static 200 = 'OK'
  static 201 = 'Created'
  static 202 = 'Accepted'
  static 203 = 'Non-authoritative Information'
  static 204 = 'No Content'
  static 205 = 'Reset Content'
  static 206 = 'Partial Content'
  static 207 = 'Multi-Status'
  static 208 = 'Already Reported'
  static 226 = 'IM Used'

  // Redirection
  static 300 = 'Multiple Choices'
  static 301 = 'Moved Permanently'
  static 302 = 'Found'
  static 303 = 'See Other'
  static 304 = 'Not Modified'
  static 305 = 'Use Proxy'
  static 307 = 'Temporary Redirect'
  static 308 = 'Permanent Redirect'

  // Client Error
  static 400 = 'Bad Request'
  static 401 = 'Unauthorized'
  static 402 = 'Payment Required'
  static 403 = 'Forbidden'
  static 404 = 'Not Found'
  static 405 = 'Method Not Allowed'
  static 406 = 'Not Acceptable'
  static 407 = 'Proxy Authentication Required'
  static 408 = 'Request Timeout'
  static 409 = 'Conflict'
  static 410 = 'Gone'
  static 411 = 'Length Required'
  static 412 = 'Precondition Failed'
  static 413 = 'Payload Too Large'
  static 414 = 'Request-URI Too Long'
  static 415 = 'Unsupported Media Type'
  static 416 = 'Requested Range Not Satisfiable'
  static 417 = 'Expectation Failed'
  static 418 = 'I\'m a teapot'
  static 421 = 'Misdirected Request'
  static 422 = 'Unprocessable Entity'
  static 423 = 'Locked'
  static 424 = 'Failed Dependency'
  static 426 = 'Upgrade Required'
  static 428 = 'Precondition Required'
  static 429 = 'Too Many Requests'
  static 431 = 'Request Header Fields Too Large'
  static 444 = 'Connection Closed Without Response'
  static 451 = 'Unavailable For Legal Reasons'
  static 499 = 'Client Closed Request'

  // Server Error
  static 500 = 'Internal Server Error'
  static 501 = 'Not Implemented'
  static 502 = 'Bad Gateway'
  static 503 = 'Service Unavailable'
  static 504 = 'Gateway Timeout'
  static 505 = 'HTTP Version Not Supported'
  static 506 = 'Variant Also Negotiates'
  static 507 = 'Insufficient Storage'
  static 508 = 'Loop Detected'
  static 510 = 'Not Extended'
  static 511 = 'Network Authentication Required'
  static 599 = 'Network Connect Timeout Error'
}
Object.freeze(HttpStatusText)


class HttpStatus {
  // Informational
  static CONTINUE = 100
  static SWITCHING_PROTOCOLS = 101
  static PROCESSING = 102

  // Success
  static OK = 200
  static CREATED = 201
  static ACCEPTED = 202
  static NON_AUTHORITATIVE_INFORMATION = 203
  static NO_CONTENT = 204
  static RESET_CONTENT = 205
  static PARTIAL_CONTENT = 206
  static MULTI_STATUS = 207
  static ALREADY_REPORTED = 208
  static IM_USED = 226

  // Redirection
  static MULTIPLE_CHOICES = 300
  static MOVED_PERMANENTLY = 301
  static FOUND = 302
  static SEE_OTHER = 303
  static NOT_MODIFIED = 304
  static USE_PROXY = 305
  static TEMPORARY_REDIRECT = 307
  static PERMANENT_REDIRECT = 308

  // Client Error
  static BAD_REQUEST = 400
  static UNAUTHORIZED = 401
  static PAYMENT_REQUIRED = 402
  static FORBIDDEN = 403
  static NOT_FOUND = 404
  static METHOD_NOT_ALLOWED = 405
  static NOT_ACCEPTABLE = 406
  static PROXY_AUTHENTICATION_REQUIRED = 407
  static REQUEST_TIMEOUT = 408
  static CONFLICT = 409
  static GONE = 410
  static LENGTH_REQUIRED = 411
  static PRECONDITION_FAILED = 412
  static PAYLOAD_TOO_LARGE = 413
  static URI_TOO_LONG = 414
  static UNSUPPORTED_MEDIA_TYPE = 415
  static RANGE_NOT_SATISFIABLE = 416
  static EXPECTATION_FAILED = 417
  static IM_A_TEAPOT = 418
  static MISDIRECTED_REQUEST = 421
  static UNPROCESSABLE_ENTITY = 422
  static LOCKED = 423
  static FAILED_DEPENDENCY = 424
  static UPGRADE_REQUIRED = 426
  static PRECONDITION_REQUIRED = 428
  static TOO_MANY_REQUESTS = 429
  static HEADER_FIELDS_TOO_LARGE = 431
  static CLOSED_WITHOUT_RESPONSE = 444
  static UNAVAILABLE_FOR_LEGAL_REASONS = 451
  static CLIENT_CLOSED_REQUEST = 499

  // Server Error
  static INTERNAL_SERVER_ERROR = 500
  static NOT_IMPLEMENTED = 501
  static BAD_GATEWAY = 502
  static SERVICE_UNAVAILABLE = 503
  static GATEWAY_TIMEOUT = 504
  static HTTP_VERSION_NOT_SUPPORTED = 505
  static VARIANT_ALSO_NEGOTIATES = 506
  static INSUFFICIENT_STORAGE = 507
  static LOOP_DETECTED = 508
  static NOT_EXTENDED = 510
  static NETWORK_AUTHENTICATION_REQUIRED = 511
  static NETWORK_CONNECTION_TIMEOUT_ERROR = 599

  // Helper Functions
  static isInformational = (code) => {
    return code >= 100 && code < 200
  }

  static isSuccess = (code) => {
    return code >= 200 && code < 300
  }

  static isRedirection = (code) => {
    return code >= 300 && code < 400
  }

  static isError = (code) => {
    return code >= 400 && code < 600
  }

  static isClientError = (code) => {
    return code >= 400 && code < 500
  }

  static isServerError = (code) => {
    return code >= 500 && code < 600
  }
}
Object.freeze(HttpStatus)





export {
  HttpStatus,
  HttpStatusText,
}
