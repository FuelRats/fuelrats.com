// Module imports
import axios from 'axios'
import getConfig from 'next/config'





const { publicRuntimeConfig } = getConfig()
const localApiUrl = publicRuntimeConfig.apis.fuelRats.local





const frApi = axios.create({
  baseURL: localApiUrl,
  timeout: 10000,
  validateStatus: () => true, // Always resolve because it's simpler for the action creators.
})





export default frApi
