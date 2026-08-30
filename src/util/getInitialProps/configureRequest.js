import nextCookies from 'next-cookies'


export default function configureRequest (ctx) {
  // Always setup access token
  const { access_token: accessToken } = nextCookies(ctx)
  if (accessToken) {
    ctx.accessToken = accessToken
  }

  // If we're on the server, collect proxy headers to retain the origin IP.
  // These are attached per-request (via the store) rather than onto the shared
  // axios instance, so concurrent SSR requests never leak each other's IP.
  if (ctx.isServer) {
    const proxyHeaders = {}

    const realIp = ctx.req.headers['x-real-ip'] ?? ctx.req.client?.remoteAddress
    if (realIp) {
      proxyHeaders['x-real-ip'] = realIp
    }

    const forwardedFor = ctx.req.headers['x-forwarded-for'] ?? ctx.req.client?.remoteAddress
    if (forwardedFor) {
      proxyHeaders['x-forwarded-for'] = forwardedFor
    }

    const forwardedProto = ctx.req.headers['x-forwarded-proto'] ?? (ctx.req.socket?.encrypted ? 'https' : 'http')
    if (forwardedProto) {
      proxyHeaders['x-forwarded-proto'] = forwardedProto
    }

    ctx.proxyHeaders = proxyHeaders
  }
}
