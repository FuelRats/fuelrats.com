import httpProxyMiddleware from 'next-http-proxy-middleware'





export default function apiProxy (...options) {
  return (res, req) => {
    return httpProxyMiddleware(req, res, {
      changeOrigin: true,
      secure: true,
      xfwd: true,
      ...options,
    })
  }
}
