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


module.exports = () => {
  return {
    distDir: 'dist',

    serverExternalPackages: ['@fortawesome/fontawesome-svg-core'],

    // Runtime config — read from process.env at startup, not baked at build.
    // Available client-side via getConfig().publicRuntimeConfig.
    publicRuntimeConfig: {
      frSocketUrl: env.frapi.socket,
      stripeApiPk: env.stripe.public,
      ircClientUrl: env.irc.client,
      ircRatUrl: env.irc.rat,
      vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    },

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
