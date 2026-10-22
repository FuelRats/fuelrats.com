import { NextResponse } from 'next/server'

import getCspHeaders from '../.config/csp.config'
import env from '../.config/env'




/**
 * Generates a nonce for each page request and applies the Content-Security-Policy that allows it. `_document` reads
 * the nonce from the `x-nonce` request header and adds it to the scripts it renders.
 * @param {import('next/server').NextRequest} request Incoming request.
 * @returns {NextResponse} Response continuing to the page, with CSP headers set.
 */
export function proxy (request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  getCspHeaders(env, nonce).forEach(({ key, value }) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
