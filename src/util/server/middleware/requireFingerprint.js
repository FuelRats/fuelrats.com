import { BadRequestAPIError } from '../errors'

export default function requireFingerprint () {
  return (ctx, next) => {
    if (!ctx.req.fingerprint) {
      throw new BadRequestAPIError({ parameter: 'X-Fingerprint' })
    }

    return next()
  }
}
