const apiErrorLocalisations = {
  bad_request: {
    title: 'Bad Request',
    detail: 'The server cannot or will not process the request due to something that is perceived to be a client error',
  },

  unauthorized: {
    title: 'Unauthorized',
    detail: 'You lack valid authentication credentials to perform this action.',
  },

  method_not_allowed: {
    title: 'Method Not Allowed',
    detail: 'The method received in the request-line is known by the origin server but not supported by the target resource.',
  },

  too_many_requests: {
    title: 'Too Many Requests',
    detail: 'The user has sent too many requests in a given amount of time and has been rate limited.',
  },

  internal_server: {
    title: 'Internal Server Error',
    detail: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },

  not_implemented: {
    title: 'Not Implemented',
    detail: 'The server does not support the functionality required to fulfill the request.',
  },

  internal_server_error: {
    title: 'Internal Server Error',
    detail: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },

  not_found: {
    title: 'Not Found',
    detail: 'The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.',
  },
}

export default apiErrorLocalisations
