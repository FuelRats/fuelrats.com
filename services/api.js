// Module imports
import axios from 'axios'
import getConfig from 'next/config'


const { publicRuntimeConfig } = getConfig()
const clientApiUrl = publicRuntimeConfig.apis.fuelRats.client


export default axios.create({
  baseURL: clientApiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})
