import axios from 'axios'


const isServer = typeof window === 'undefined'

const wpApi = axios.create({
  baseURL: isServer ? `${process.env.APP_URL}/api/wp` : '/api/wp',
  timeout: 10000,
  validateStatus: () => {
    return true // Always resolve because it's simpler for the action creators.
  },
})




export default wpApi
