import { HttpStatus } from '@fuelrats/web-util/http'
import Router from 'next/router'





export default function pageRedirect (ctx, route) {
  let href = null
  let as = null

  if (typeof route === 'object') {
    href = route.href
    as = route.as
  } else if (typeof route === 'string') {
    as = route
  }

  if (ctx.res) {
    ctx.res.writeHead(HttpStatus.FOUND, {
      Location: as,
    })
    ctx.res.end()
  } else if (route.startsWith('http')) {
    if (typeof window !== 'undefined') {
      window.location.replace(as)
    }
  } else {
    Router.replace(href ?? as, as)
  }
}
