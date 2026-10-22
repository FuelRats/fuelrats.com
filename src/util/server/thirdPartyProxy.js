import { HttpMethod, HttpStatus } from '@fuelrats/web-util/http'

import apiProxy from './apiProxy'


const ALLOWED_METHODS = [HttpMethod.GET, HttpMethod.HEAD]

// Encoded slashes, backslashes and dots, or dot segments, could step outside the upstream path the request is rewritten
// onto.
const UNSAFE_PATH_PATTERN = /%2f|%5c|%2e|(?:^|\/)\.{1,2}(?:\/|$)/iu

const ACTIVE_CONTENT_TYPE_PATTERN = /javascript|ecmascript/iu

// Upstream responses are served from our own origin, so they must not be able to run script there: documents are
// sandboxed, and script is relabelled so browsers refuse to execute it.
const UPSTREAM_CSP = "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox"


// Our cookies and credentials are for our own API, never for a third party.
function stripCredentials (proxyReq) {
  proxyReq.removeHeader('cookie')
  proxyReq.removeHeader('authorization')
}

function sanitiseResponse (response) {
  delete response.headers['set-cookie']

  if (ACTIVE_CONTENT_TYPE_PATTERN.test(response.headers['content-type'] ?? '')) {
    response.headers['content-type'] = 'text/plain; charset=utf-8'
  }
  response.headers['content-security-policy'] = UPSTREAM_CSP
  response.headers['x-content-type-options'] = 'nosniff'
}

/**
 * Read-only proxy to a third-party service. Only GET and HEAD are relayed, our cookies and credentials are never sent
 * upstream, and upstream cookies and active content never reach the client.
 * @param {object} options http-proxy-middleware options.
 * @returns {Function} Request handler.
 */
export default function thirdPartyProxy (options) {
  const proxy = apiProxy({
    ...options,
    on: {
      proxyReq: stripCredentials,
      proxyRes: sanitiseResponse,
    },
  })

  return function thirdPartyProxyHandler (req, res, next) {
    if (!ALLOWED_METHODS.includes(req.method)) {
      res.setHeader('Allow', ALLOWED_METHODS.join(', '))
      res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
      return undefined
    }

    const [path] = req.url.split('?')
    if (UNSAFE_PATH_PATTERN.test(path)) {
      res.status(HttpStatus.BAD_REQUEST).end()
      return undefined
    }

    return proxy(req, res, next)
  }
}
