import { createProxyMiddleware } from 'http-proxy-middleware'





export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

export default function apiProxy (options) {
  return createProxyMiddleware({
    changeOrigin: true,
    secure: true,
    xfwd: true,
    ...options,
  })
}
