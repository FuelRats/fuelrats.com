/* eslint-env node */
const crypto = require('crypto')

const ciEnv = require('./.config/ciEnv')
const env = require('./.config/env')
const headersConfig = require('./.config/headers.config')
const publicRuntimeConfig = require('./.config/publicRuntime.config')
const redirectsConfig = require('./.config/redirects.config')
const rewritesConfig = require('./.config/rewrites.config')
const webpackConfig = require('./.config/webpack.config')


// Constants
const DEV_BUILD_ID_LENGTH = 16





module.exports = () => {
  return {
    distDir: 'dist',

    images: {
      disableStaticImages: true,
      domains: [
        'wordpress.fuelrats.com',
        'static-cdn.jtvnw.net',
      ],
    },

    eslint: {
      // Ignore ESLint in builds as our CI Takes care of this for us.
      ignoreDuringBuilds: true,
    },

    headers: headersConfig(env),
    publicRuntimeConfig: publicRuntimeConfig(env),
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
