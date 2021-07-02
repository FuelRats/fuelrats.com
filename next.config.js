/* eslint-env node */
const crypto = require('crypto')
const path = require('path')
const url = require('url')

const publicRuntimeConfig = require('./.next/publicRuntime.config')
const redirectsConfig = require('./.next/redirects.config')
const rewritesConfig = require('./.next/rewrites.config')
const webpackConfig = require('./.next/webpack.config')
const getEnv = require('./src/util/server/getEnv')



// Constants
const env = getEnv()


const DEV_BUILD_ID_LENGTH = 16



module.exports = {
  distDir: path.join('dist', 'next'),

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
