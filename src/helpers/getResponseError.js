import { isError } from 'flux-standard-action'

export default function getResponseError (action) {
  if (!isError(action)) {
    return undefined
  }

  if (action.payload?.errors?.length) {
    return action.payload.errors[0]
  }

  if (action.meta.error) {
    return action.meta.error
  }

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
