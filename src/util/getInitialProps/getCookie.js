import jsCookie from 'js-cookie'

// Cookie headers come from the client, so fall back to the raw value if it isn't valid URI encoding
const decodeCookieValue = (value) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export default function getCookie (cookieName, ctx = {}) {
  if (ctx.req) {
    const cookie = ctx.req.headers.cookie
      ?.split(';')
      .map((pair) => {
        return pair.trim()
      })
      .find((pair) => {
        return pair.startsWith(`${cookieName}=`)
      })

    return cookie ? decodeCookieValue(cookie.slice(cookieName.length + 1)) : undefined
  }

  return jsCookie.get(cookieName)
}
