import env from '../../../.config/env'

const { info, error, warn } = require('next/dist/build/output/log')




// Config the app cannot serve without. Missing any of these is a hard error in
// production; in development we only warn so local work isn't blocked.
const REQUIRED_KEYS = [
  ['appUrl', 'APP_URL'],
  ['frapi.clientId', 'FR_API_KEY'],
  ['frapi.clientSecret', 'FR_API_SECRET'],
]

// Config that gates specific routes (Stripe donations, QMS). A clear warning
// beats a confusing failure deep inside the route that needs it.
const RECOMMENDED_KEYS = [
  ['stripe.secret', 'FR_STRIPE_API_SK'],
  ['qms.token', 'QMS_API_TOKEN'],
]


const resolvePath = (source, path) => {
  return path.split('.').reduce((value, key) => {
    return value?.[key]
  }, source)
}

const collectMissing = (source, keys) => {
  return keys
    .filter(([path]) => {
      return !resolvePath(source, path)
    })
    .map(([, envVar]) => {
      return envVar
    })
}


let envRef = null


function validateEnv (source) {
  const missingRecommended = collectMissing(source, RECOMMENDED_KEYS)
  if (missingRecommended.length) {
    warn(`Missing optional environment variables: ${missingRecommended.join(', ')}. Related features will be unavailable.`)
  }

  const missingRequired = collectMissing(source, REQUIRED_KEYS)
  if (missingRequired.length) {
    const message = `Missing required environment variables: ${missingRequired.join(', ')}.`
    if (source.isDev) {
      error(message)
    } else {
      throw new Error(message)
    }
  }
}




export default function getEnv () {
  if (!envRef) {
    info('Reading from process.env')
    validateEnv(env)
    envRef = env
  }

  return envRef
}
