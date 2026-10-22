import { createProxyMiddleware } from 'http-proxy-middleware'


export default function apiProxy (options) {
  return createProxyMiddleware({
    changeOrigin: true,
    secure: true,
    xfwd: true,
    ...options,
  })
}
