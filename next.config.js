/* eslint-env node */
const crypto = require('crypto')
const url = require('url')

const headersConfig = require('./.config/headers.config')
const publicRuntimeConfig = require('./.config/publicRuntime.config')
const redirectsConfig = require('./.config/redirects.config')
const rewritesConfig = require('./.config/rewrites.config')
const webpackConfig = require('./.config/webpack.config')
const getEnv = require('./src/util/server/getEnv')


// Constants
const DEV_BUILD_ID_LENGTH = 16





module.exports = () => {
  const env = getEnv()

  return {
    distDir: 'dist',

    images: {
      disableStaticImages: true,
      domains: [
        url.parse(env.appUrl).hostname, // Ensure the public hostname is always allowed.
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
      const buildId = env.git.ci
        ? env.git.commit
        : crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()

      return `${env.git.branch}_${buildId}`
    },

  }
}
