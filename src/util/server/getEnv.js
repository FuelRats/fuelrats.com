import env from '../../../.config/env'

const { info } = require('next/dist/build/output/log')





let envRef = null





export default function getEnv () {
  if (!envRef) {
    // While not strictly neccessary, we're going to keep this generator here for future expansion.
    info('Reading from process.env')
    envRef = env
  }

  return envRef
}
