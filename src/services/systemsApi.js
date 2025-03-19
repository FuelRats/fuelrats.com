import axios from 'axios'
import getConfig from 'next/config'





const { publicRuntimeConfig } = getConfig()
const localSystemsApiUrl = publicRuntimeConfig.sapi.url





const systemsApi = axios.create({
  baseURL: localSystemsApiUrl,
  timeout: 10000,
  validateStatus: () => {
    return true // Always resolve because it's simpler for the action creators.
  },
})





export default systemsApi
