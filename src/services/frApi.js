import axios from 'axios'
import qs from 'qs'




const frApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FR_API_URL,
  timeout: 10000,
  paramsSerializer: qs.stringify,

  validateStatus () {
    return true // Always resolve because it's simpler for the action creators.
  },
})




export default frApi
