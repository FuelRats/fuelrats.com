export default function setError (ctx, statusCode, message) {
  if (ctx.res) {
    ctx.res.statusCode = statusCode
  }
  ctx.err = { statusCode, message }
}
