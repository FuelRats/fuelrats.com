import axios from 'axios'
import qs from 'qs'


const isServer = typeof window === 'undefined'

const frApi = axios.create({
  baseURL: isServer ? `${process.env.APP_URL}/api/fr` : '/api/fr',
  timeout: 10000,
  paramsSerializer: qs.stringify,

  validateStatus () {
    return true // Always resolve because it's simpler for the action creators.
  },
})




export default frApi
