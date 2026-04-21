import { HttpStatus } from '@fuelrats/web-util/http'

import getEnv from '~/util/server/getEnv'


export const config = {
  api: {
    bodyParser: false,
  },
}


export default async function handler (req, res) {
  if (req.method !== 'POST') {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }

  const { userId } = req.query
  if (!userId) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: 'userId is required' })
    return
  }

  const apiUrl = getEnv()?.frapi?.url
  if (!apiUrl) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'API URL not configured' })
    return
  }

  const targetUrl = `${apiUrl}/users/${userId}/image`

  const headers = {}
  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization
  }
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type']
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: req,
      duplex: 'half',
    })

    const data = await response.text()
    res.status(response.status)
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-type') {
        res.setHeader('Content-Type', value)
      }
    })
    res.end(data)
  } catch {
    res.status(HttpStatus.BAD_GATEWAY).json({ error: 'Failed to upload avatar' })
  }
}
