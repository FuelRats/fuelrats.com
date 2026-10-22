import { Avatar, Style } from '@dicebear/core'
import thumbs from '@dicebear/styles/thumbs.json'
import { HttpMethod, HttpStatus } from '@fuelrats/web-util/http'



// Constants
const MIN_SIZE = 32
const MAX_SIZE = 512
const DEFAULT_SIZE = 128
const CACHE_MAX_AGE = 604800 // 7 days

const avatarStyle = new Style(thumbs)


/**
 * Generated fallback avatars for users without an uploaded image, served as SVG.
 *
 * `GET /api/avatars/:seed/:size?` renders the same avatar for the same seed (usually a user ID), sized between
 * `MIN_SIZE` and `MAX_SIZE` pixels.
 * @param {import('next').NextApiRequest} req Incoming request.
 * @param {import('next').NextApiResponse} res Outgoing response.
 */
export default function avatars (req, res) {
  if (![HttpMethod.GET, HttpMethod.HEAD].includes(req.method)) {
    res.setHeader('Allow', `${HttpMethod.GET}, ${HttpMethod.HEAD}`)
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }

  const [seed, rawSize] = req.query.slug ?? []
  const size = rawSize ? Number(rawSize) : DEFAULT_SIZE

  if (!seed || !Number.isInteger(size) || size < MIN_SIZE || size > MAX_SIZE) {
    res.status(HttpStatus.BAD_REQUEST).end()
    return
  }

  const svg = new Avatar(avatarStyle, { seed, size }).toString()

  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`)
  res.status(HttpStatus.OK).send(svg)
}
