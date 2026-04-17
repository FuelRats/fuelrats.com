const apiErrorLocalisations = {
  bad_request: {
    title: 'Bad Request',
    detail: 'There was a problem with this request. Please try again.',
  },

  unauthorized: {
    title: 'Unauthorized',
    detail: 'You lack valid authentication credentials to perform this action.',
  },

  forbidden: {
    title: 'Forbidden',
    detail: 'You do not have permission to perform this action.',
  },

  authenticator_required: {
    title: 'Two-Factor Code Required',
    detail: 'A two-factor authentication code is required for this account.',
  },

  reset_required: {
    title: 'Password Reset Required',
    detail: 'You must reset your password before continuing.',
  },

  verification_required: {
    title: 'Verification Required',
    detail: 'Please verify your email address before continuing.',
  },

  not_found: {
    title: 'Not Found',
    detail: 'The requested resource could not be found.',
  },

  method_not_allowed: {
    title: 'Method Not Allowed',
    detail: 'The method received in the request-line is known by the origin server but not supported by the target resource.',
  },

  conflict: {
    title: 'Conflict',
    detail: 'That value is already in use.',
  },

  gone: {
    title: 'Account Suspended',
    detail: 'This account has been suspended. If you believe this is a mistake, please contact ops@fuelrats.com.',
  },

  payload_too_large: {
    title: 'File Too Large',
    detail: 'The file you tried to upload is too large.',
  },

  unsupported_media_type: {
    title: 'Unsupported Media Type',
    detail: 'The server does not support the media type of the request.',
  },

  unprocessable_entity: {
    title: 'Invalid Data',
    detail: 'One or more fields contained invalid data. Please review your input and try again.',
  },

  too_many_requests: {
    title: 'Too Many Requests',
    detail: 'You are sending requests too quickly. Please wait a moment and try again.',
  },

  internal_server: {
    title: 'Internal Server Error',
    detail: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },

  internal_server_error: {
    title: 'Internal Server Error',
    detail: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },

  not_implemented: {
    title: 'Not Implemented',
    detail: 'This feature is not yet available.',
  },
}

export default apiErrorLocalisations
