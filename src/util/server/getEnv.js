/* eslint-env node */

function requireEnv (name) {
  throw new TypeError(`Expected required variable 'process.env.${name}' to be defined.`)
}

const COMMIT_HASH_LENGTH = 10

let env = null

export default function getEnv () {
  if (!env) {
    if (typeof process === 'undefined') {
      return null
    }

    const {
      CI = false,
      PORT = 3000,
      APP_URL = requireEnv('APP_URL'),
      APP_PROXIED = false,
      NODE_ENV,
      FR_API_KEY = requireEnv('FR_API_KEY'),
      FR_API_SECRET = requireEnv('FR_API_SECRET'),
      FR_API_URL = 'https://dev.api.fuelrats.com',
      FR_CLIENT_IRC_URL = 'https://qms.fuelrats.dev',
      FR_EDSM_API_URL = 'https://www.edsm.net',
      FR_FALLBACK_URL = 'https://fallback.fuelrats.com/',
      FR_RAT_IRC_URL = 'https://kiwi.fuelrats.com',
      FR_SOCKET_URL = 'wss://dev.api.fuelrats.com',
      FR_STRIPE_API_PK,
      FR_STRIPE_API_SK,
      FR_STRIPE_BANS_FILE,
      FR_WORDPRESS_URL = 'https://wordpress.fuelrats.com',
      GITHUB_REF = 'develop',
      GITHUB_RUN_ID,
      GITHUB_SERVER_URL = 'https://github.com',
      GITHUB_SHA,
      QMS_API_URL = 'https://api.qms.fuelrats.dev',
      QMS_API_TOKEN,
    } = process.env

    env = {
      appUrl: APP_URL,
      proxied: APP_PROXIED,
      isDev: NODE_ENV !== 'production',
      port: PORT,
      fallbackUrl: FR_FALLBACK_URL,
      frapi: {
        url: FR_API_URL,
        proxy: `${APP_URL}/api/fr`,
        socket: FR_SOCKET_URL,
        clientId: FR_API_KEY,
        clientSecret: FR_API_SECRET,
      },
      edsm: {
        url: FR_EDSM_API_URL,
        proxy: `${APP_URL}/api/edsm`,
      },
      wordpress: {
        url: FR_WORDPRESS_URL,
        proxy: `${APP_URL}/api/wp`,
      },
      stripe: {
        url: `${APP_URL}/api/stripe`,
        public: FR_STRIPE_API_PK,
        secret: FR_STRIPE_API_SK,
        bansFile: FR_STRIPE_BANS_FILE,
      },
      qms: {
        url: QMS_API_URL,
        token: QMS_API_TOKEN,
      },
      irc: {
        client: FR_CLIENT_IRC_URL,
        rat: FR_RAT_IRC_URL,
      },
      git: {
        // Git CI vars. Will not typically be defined at runtime.
        // These exist to be used by DefinePlugin at build time.
        ci: CI,
        ciId: GITHUB_RUN_ID,
        server: GITHUB_SERVER_URL,
        branch: GITHUB_REF?.replace(/^refs\/heads\//u, '')?.replace(/\//gu, '-') ?? null,
        commit: GITHUB_SHA?.toLowerCase() ?? null,
        commitShort: GITHUB_SHA?.slice(0, COMMIT_HASH_LENGTH)?.toLowerCase() ?? null,
      },
    }
  }

  return env
}
