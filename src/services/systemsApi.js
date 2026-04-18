import axios from 'axios'


const isServer = typeof window === 'undefined'

const systemsApi = axios.create({
  baseURL: isServer ? `${process.env.APP_URL}/api/sapi` : '/api/sapi',
  timeout: 10000,
  validateStatus: () => {
    return true // Always resolve because it's simpler for the action creators.
  },
})




export default systemsApi
