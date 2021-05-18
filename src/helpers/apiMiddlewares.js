import { isRequired } from '@fuelrats/validation-util'
import { HttpStatus } from '@fuelrats/web-util/http'




export function methodRouter (handlers = isRequired('handlers')) {
  return async (req, res) => {
    const methodHandler = handlers[req.method]

    if (typeof methodHandler === 'function') {
      await methodHandler(req, res)
      return
    }

    res.setHeader('Allow', Object.keys(handlers))
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`)
  }
}
