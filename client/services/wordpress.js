// Module imports
import axios from 'axios'
import getConfig from 'next/config'





const { publicRuntimeConfig } = getConfig()
const localWordpressApiUrl = publicRuntimeConfig.apis.wordpress.url





const wpApi = axios.create({
  baseURL: localWordpressApiUrl,
  timeout: 10000,
  validateStatus: () => true, // Always resolve because it's simpler for the action creators.
})





export default wpApi
