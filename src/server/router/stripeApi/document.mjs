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
  try {
    await next()

    if (!ctx.body) {
      throw new InternalServerError()
    }

    ctx.status = 200
    ctx.body = new ResponseDocument({
      ctx,
      data: ctx.body,
    })
  } catch (error) {
    // Only expose internal errors in dev mode
    const internalError = ctx.state.env.isDev
      ? error
      : undefined

    ctx.status = typeof error?.code === 'number' ? error.code : HttpStatus.INTERNAL_SERVER_ERROR
    ctx.body = new ResponseDocument({
      ctx,
      errors: [
        error instanceof ApiError
          ? error
          : new InternalServerError({
            internalError,
          }),
      ],
    })
  }

  ctx.type = 'application/json'
  ctx.body = JSON.stringify(ctx.body)
}





export default prepareResponse
