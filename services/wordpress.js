// Module imports
import axios from 'axios'
import getConfig from 'next/config'


const { publicRuntimeConfig } = getConfig()
const localWordpressApiUrl = publicRuntimeConfig.apis.wordpress.url

let instance = null





export default function () {
  return instance || (instance = axios.create({
    baseURL: localWordpressApiUrl,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  }))
}
