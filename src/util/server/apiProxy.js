import { createProxyMiddleware } from 'http-proxy-middleware'

import getClientIp from './getClientIp'


// Client IPs resolved before the proxy runs, since its `xfwd` option appends to the incoming X-Forwarded-For header.
const clientIps = new WeakMap()

// Replaces any client-supplied forwarding headers with the resolved client IP, so upstreams can't be given a spoofed
// address.
function forwardClientIp (proxyReq, req) {
  const clientIp = clientIps.get(req)
  if (!clientIp) {
    proxyReq.removeHeader('x-forwarded-for')
    proxyReq.removeHeader('x-real-ip')
    return
  }

  proxyReq.setHeader('x-forwarded-for', clientIp)
  proxyReq.setHeader('x-real-ip', clientIp)
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

export default function apiProxy (options) {
  const proxy = createProxyMiddleware({
    changeOrigin: true,
    secure: true,
    xfwd: true,
    ...options,
    on: {
      ...options?.on,
      proxyReq: (proxyReq, req, res) => {
        forwardClientIp(proxyReq, req)
        options?.on?.proxyReq?.(proxyReq, req, res)
      },
    },
  })

  return function apiProxyHandler (req, res, next) {
    clientIps.set(req, getClientIp(req))
    return proxy(req, res, next)
  }
}
