import axios from 'axios'
import getConfig from 'next/config'
import qs from 'qs'





const { publicRuntimeConfig } = getConfig()

const frApi = axios.create({
  baseURL: publicRuntimeConfig.frapi.url,
  timeout: 10000,
  paramsSerializer: qs.stringify,

  validateStatus () {
    return true // Always resolve because it's simpler for the action creators.
  },
})





export default frApi
