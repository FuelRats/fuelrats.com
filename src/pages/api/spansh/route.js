import { HttpStatus } from '@fuelrats/web-util/http'

const DEFAULT_RANGE = 65

export default async function handler (req, res) {
  if (req.method !== 'POST') {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }

  const { from, to, range, efficiency } = req.body ?? {}
  if (!from || !to) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: 'from and to are required' })
    return
  }

  const body = new URLSearchParams({
    from,
    to,
    range: String(range ?? DEFAULT_RANGE),
    efficiency: String(efficiency ?? 60),
  })

  try {
    const response = await fetch('https://spansh.co.uk/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'Unexpected response from route provider' })
      return
    }

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    console.error('[spansh] route request failed:', error)
    res.status(HttpStatus.BAD_GATEWAY).json({ error: 'Failed to reach route provider' })
  }
}
