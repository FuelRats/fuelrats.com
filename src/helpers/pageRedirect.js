import { Router } from '../routes'
import HttpStatus from './HttpStatus'





const pageRedirect = (ctx, route) => {
  if (ctx.res) {
    ctx.res.writeHead(HttpStatus.FOUND, {
      Location: route,
    })
    ctx.res.end()
    ctx.res.finished = true
  } else {
    Router.replace(route)
  }
}





export default pageRedirect
