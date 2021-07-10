import jsCookie from 'js-cookie'

export default function deleteCookie (cookieName, ctx = {}) {
  if (ctx.res) {
    ctx.res.setHeader('Set-Cookie', `${cookieName}=null; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
  } else {
    jsCookie.remove(cookieName)
  }
}
