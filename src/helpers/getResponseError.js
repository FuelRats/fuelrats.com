import { isError } from 'flux-standard-action'

export default function getResponseError (action) {
  // Return if not valid FSA error
  if (!isError(action)) {
    return undefined
  }

  // JSONAPI error object
  if (action.payload?.errors?.length) {
    return action.payload.errors[0]
  }

  // oAuth 2.0 error object
  if (typeof action.payload?.error === 'string' && typeof action.payload?.['error_description'] === 'string') {
    return action.payload
  }

  // Internal error
  if (action.meta.error) {
    return action.meta.error
  }

  // We have an error but it's not documented so we will simulate a 500.
  // This honestly shouldn't happen ever, but a good safeguard.
  return {
    links: {
      about: 'https://httpstatuses.com/500',
    },
    status: 'internal_server',
    code: 500,
    title: 'Internal Server Error',
    detail: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
    source: { },
  }
}
