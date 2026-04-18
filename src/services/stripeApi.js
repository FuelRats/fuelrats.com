import axios from 'axios'


const isServer = typeof window === 'undefined'

const stripeApi = axios.create({
  baseURL: isServer ? `${process.env.APP_URL}/api/stripe` : '/api/stripe',
  timeout: 10000,
  validateStatus: () => {
    return true // Always resolve because it's simpler for the action creators.
  },
})




export default stripeApi
