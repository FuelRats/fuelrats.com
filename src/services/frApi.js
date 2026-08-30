import axios from 'axios'
import qs from 'qs'


const isServer = typeof window === 'undefined'

// Server-side rendering hits the API directly when FR_SSR_API_URL is set, instead of
// looping back through this app's own /api/fr proxy. The self-proxy deadlocks the Next
// dev server (SSR blocks on a request it can't serve concurrently). Unset in production,
// where SSR keeps proxying through APP_URL.
const serverBaseURL = process.env.FR_SSR_API_URL ?? `${process.env.APP_URL}/api/fr`

const frApi = axios.create({
  baseURL: isServer ? serverBaseURL : '/api/fr',
  timeout: 10000,
  paramsSerializer: qs.stringify,

  validateStatus () {
    return true // Always resolve because it's simpler for the action creators.
  },
})




export default frApi
