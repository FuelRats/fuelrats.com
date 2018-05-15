// Module imports
import axios from 'axios'





export default axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})
