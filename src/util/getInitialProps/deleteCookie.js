import jsCookie from 'js-cookie'

export default function deleteCookie (cookieName, ctx = {}) {
  if (ctx.res) {
    const newCookie = `${cookieName}=null; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    const existingCookies = ctx.res.getHeader('Set-Cookie')
    const cookies = Array.isArray(existingCookies)
      ? existingCookies
      : [existingCookies].filter((cookie) => {
        return typeof cookie !== 'undefined'
      })
    cookies.push(newCookie)
    ctx.res.setHeader('Set-Cookie', cookies)
  } else {
    jsCookie.remove(cookieName)
  }
}
