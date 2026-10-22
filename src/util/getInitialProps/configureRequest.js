import nextCookies from 'next-cookies'

import getClientIp from '~/util/server/getClientIp'


export default function configureRequest (ctx) {
  // Always setup access token
  const { access_token: accessToken } = nextCookies(ctx)
  if (accessToken) {
    ctx.accessToken = accessToken
  }

  // If we're on the server, collect proxy headers to retain the origin IP.
  // These are attached per-request (via the store) rather than onto the shared
  // axios instance, so concurrent SSR requests never leak each other's IP.
  if (ctx.req) {
    const proxyHeaders = {}

    const clientIp = getClientIp(ctx.req)
    if (clientIp) {
      proxyHeaders['x-real-ip'] = clientIp
      proxyHeaders['x-forwarded-for'] = clientIp
    }

    const forwardedProto = ctx.req.headers['x-forwarded-proto'] ?? (ctx.req.socket?.encrypted ? 'https' : 'http')
    if (forwardedProto) {
      proxyHeaders['x-forwarded-proto'] = forwardedProto
    }

    ctx.proxyHeaders = proxyHeaders
  }
}
