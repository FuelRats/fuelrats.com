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

  const response = await fetch('https://spansh.co.uk/api/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = await response.json()
  res.status(response.status).json(data)
}
