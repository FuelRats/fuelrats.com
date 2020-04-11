import HttpStatus from '../../../helpers/HttpStatus'
import { ApiError, InternalServerError } from './error'


class ResponseDocument {
  meta = {}
  data = {}
  errors = undefined

  constructor ({ ctx, data, errors, meta = {} }) {
    this.data = data
    this.errors = errors
    this.meta = meta

    if (ctx.state.traffic) {
      this.meta.rateLimitTotal = ctx.state.traffic.total
      this.meta.rateLimitRemaining = ctx.state.traffic.remaining
      this.meta.rateLimitReset = ctx.state.traffic.reset
    }
  }

  toJSON () {
    return {
      data: this.errors ? undefined : this.data, // Do not send data obj if errors exist
      errors: this.errors,
      meta: this.meta,
    }
  }
}

const prepareResponse = async (ctx, next) => {
  ctx.status = 200
  ctx.type = 'application/json'
  let body = null

  try {
    const data = await next()

    if (!data) {
      throw new InternalServerError()
    }

    body = new ResponseDocument({
      ctx,
      data,
    })
  } catch (error) {
    ctx.status = error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR

    if (error instanceof ApiError) {
      body = error
    } else {
      body = new InternalServerError(error.message)
    }

    body = new ResponseDocument({
      ctx,
      errors: [
        error instanceof ApiError ? error : new InternalServerError(error.message, error),
      ],
    })
  }


  ctx.body = JSON.stringify(body)
}





export default prepareResponse
