const fs = require('fs')
const path = require('path')

const DEFAULT_PORT = 3000

// Helper function to read Docker secret or fallback to environment variable
function getSecret (secretName, envVar) {
  // First, try to read from Docker secret
  const secretPath = path.join('/run/secrets', secretName)
  try {
    if (fs.existsSync(secretPath)) {
      const secret = fs.readFileSync(secretPath, 'utf8').trim()
      if (secret) {
        return secret
      }
    }
  } catch (err) {
    // Ignore errors, fall back to env var
  }

  // Fall back to environment variable
  return process.env[envVar]
}

const env = Object.freeze({
  appUrl: process.env.APP_URL,
  proxied: process.env.APP_PROXIED,
  isDev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT ?? DEFAULT_PORT,
  fallbackUrl: process.env.FR_FALLBACK_URL ?? 'https://fallback.fuelrats.com/',
  frapi: {
    url: process.env.FR_API_URL ?? 'https://dev.api.fuelrats.com',
    proxy: `${process.env.APP_URL}/api/fr`,
    socket: process.env.FR_SOCKET_URL ?? 'wss://dev.api.fuelrats.com',
    clientId: getSecret('fr_api_key', 'FR_API_KEY'),
    clientSecret: getSecret('fr_api_secret', 'FR_API_SECRET'),
  },
  edsm: {
    url: process.env.FR_EDSM_API_URL ?? 'https://www.edsm.net/api-v1',
    proxy: `${process.env.APP_URL}/api/edsm`,
  },
  wordpress: {
    url: process.env.FR_WORDPRESS_URL ?? 'https://wordpress.fuelrats.com',
    proxy: `${process.env.APP_URL}/api/wp`,
  },
  stripe: {
    url: `${process.env.APP_URL}/api/stripe`,
    public: getSecret('fr_stripe_api_pk', 'FR_STRIPE_API_PK'),
    secret: getSecret('fr_stripe_api_sk', 'FR_STRIPE_API_SK'),
    bansFile: getSecret('fr_stripe_bans_file', 'FR_STRIPE_BANS_FILE'),
  },
  qms: {
    url: process.env.QMS_API_URL ?? 'https://api.qms.fuelrats.dev',
    token: getSecret('qms_api_token', 'QMS_API_TOKEN'),
  },
  irc: {
    client: process.env.FR_CLIENT_IRC_URL ?? 'https://qms.fuelrats.dev',
    rat: process.env.FR_RAT_IRC_URL ?? 'https://kiwi.fuelrats.com',
  },
  sapi: {
    url: process.env.FR_SAPI_URL ?? 'https://systems.api.fuelrats.com',
    proxy: `${process.env.APP_URL}/api/sapi`,
  },
})

module.exports = env
