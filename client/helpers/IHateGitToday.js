/* eslint-disable no-magic-numbers */// Not even gonna bother defining consts when it's clear what the numbers here are for.





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





export default HttpStatus
