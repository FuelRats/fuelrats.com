import axios from 'axios'




const stripeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRIPE_URL,
  timeout: 10000,
  validateStatus: () => {
    return true // Always resolve because it's simpler for the action creators.
  },
})




export default stripeApi
