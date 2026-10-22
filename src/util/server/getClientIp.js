/**
 * Resolves the IP address of the client a request came from. Behind the reverse proxy (`APP_PROXIED`), that is the
 * rightmost X-Forwarded-For entry, which the proxy adds itself; every entry before it was supplied by the client.
 *
 * Reads `APP_PROXIED` directly rather than through `.config/env`, so the page-level code that imports this doesn't
 * pull the server's environment config into the client bundle.
 * @param {import('http').IncomingMessage} req Incoming request.
 * @returns {string} The client's IP address, or an empty string if it can't be determined.
 */
export default function getClientIp (req) {
  if (process.env.APP_PROXIED === 'true') {
    const forwardedIp = req.headers['x-forwarded-for']?.split(',').at(-1).trim()
    if (forwardedIp) {
      return forwardedIp
    }
  }

  return req.socket?.remoteAddress ?? ''
}
