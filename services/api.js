// Module imports
import axios from 'axios'
import getConfig from 'next/config'


const { publicRuntimeConfig } = getConfig()
const localApiUrl = publicRuntimeConfig.apis.fuelRats.local

let instance = null





export default function () {
  return instance || (instance = axios.create({
    baseURL: localApiUrl,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  }))
}
