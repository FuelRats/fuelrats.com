/* eslint-env node */
const crypto = require('crypto')

const ciEnv = require('./.config/ciEnv')
const env = require('./.config/env')
const headersConfig = require('./.config/headers.config')
const redirectsConfig = require('./.config/redirects.config')
const rewritesConfig = require('./.config/rewrites.config')
const webpackConfig = require('./.config/webpack.config')


// Constants
const DEV_BUILD_ID_LENGTH = 16


// Derive the client-exposed values from the existing env.js config and
// expose them under NEXT_PUBLIC_* names. Setting them on process.env here
// (before the Next.js server finishes booting) makes them available for
// both server-side runtime reads and client-side compile-time replacement.
const publicEnv = {
  NEXT_PUBLIC_APP_URL: env.appUrl,
  NEXT_PUBLIC_FR_API_URL: env.frapi.proxy,
  NEXT_PUBLIC_FR_SOCKET_URL: env.frapi.socket,
  NEXT_PUBLIC_SAPI_URL: env.sapi.proxy,
  NEXT_PUBLIC_WORDPRESS_URL: env.wordpress.proxy,
  NEXT_PUBLIC_STRIPE_URL: env.stripe.url,
  NEXT_PUBLIC_STRIPE_API_PK: env.stripe.public,
  NEXT_PUBLIC_IRC_CLIENT_URL: env.irc.client,
  NEXT_PUBLIC_IRC_RAT_URL: env.irc.rat,
}

for (const [key, value] of Object.entries(publicEnv)) {
  if (value !== undefined && process.env[key] === undefined) {
    process.env[key] = value
  }
}


module.exports = () => {
  return {
    distDir: 'dist',

    serverExternalPackages: ['@fortawesome/fontawesome-svg-core'],

    // Client-side static replacement via Next.js. Replaces the deprecated
    // publicRuntimeConfig.
    env: publicEnv,

    images: {
      disableStaticImages: true,
      remotePatterns: [
        { protocol: 'https', hostname: 'wordpress.fuelrats.com' },
        { protocol: 'https', hostname: 'static-cdn.jtvnw.net' },
      ],
    },

    eslint: {
      // Ignore ESLint in builds as our CI Takes care of this for us.
      ignoreDuringBuilds: true,
    },

    headers: headersConfig(env),
    redirects: redirectsConfig(env),
    rewrites: rewritesConfig(env),
    webpack: webpackConfig(env),

    generateBuildId: () => {
      const buildId = ciEnv.isCi
        ? ciEnv.commit
        : crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()

      return `${ciEnv.branch}_${buildId}`
    },

  }
}
