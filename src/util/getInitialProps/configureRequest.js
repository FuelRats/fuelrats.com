import nextCookies from 'next-cookies'

import frApi from '~/services/frApi'





export default function configureRequest (ctx) {
  // Always setup access token
  const { access_token: accessToken } = nextCookies(ctx)
  if (accessToken) {
    ctx.accessToken = accessToken
  }

  // If we're on the server, we should set proxy headers to retain origin IP
  if (ctx.isServer) {
    const realIp = ctx.req.headers['x-real-ip'] ?? ctx.req.client?.remoteAddress
    if (realIp) {
      frApi.defaults.headers.common['x-real-ip'] = realIp
    }

    const forwardedFor = ctx.req.headers['x-forwarded-for'] ?? ctx.req.client?.remoteAddress
    if (forwardedFor) {
      frApi.defaults.headers.common['x-forwarded-for'] = forwardedFor
    }

    const forwardedProto = ctx.req.headers['x-forwarded-proto'] ?? ctx.req.headers.host
    if (forwardedProto) {
      frApi.defaults.headers.common['x-forwarded-proto'] = forwardedProto
    }
  }
}
