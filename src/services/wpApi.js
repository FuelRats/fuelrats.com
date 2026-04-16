import axios from 'axios'




const wpApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  timeout: 10000,
  validateStatus: () => {
    return true // Always resolve because it's simpler for the action creators.
  },
})




export default wpApi
