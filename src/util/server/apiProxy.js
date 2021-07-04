import { createProxyMiddleware } from 'http-proxy-middleware'





const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

function apiProxy (options) {
  return createProxyMiddleware({
    changeOrigin: true,
    secure: true,
    xfwd: true,
    ...options,
  })
}





export default apiProxy
export { config }
