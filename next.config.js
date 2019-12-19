/* eslint-env node */

// Module imports
const withSass = require('@zeit/next-sass')
const withWorkers = require('@zeit/next-workers')
const crypto = require('crypto')
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')




// Component constants
const {
  BUILD_VCS_BRANCH,
  BUILD_VCS_NUMBER,
  FRDC_API_URL,
  FRDC_PUBLIC_URL,
  FRDC_STRIPE_API_PK,
  PORT,
  TEAMCITY,
  TEAMCITY_BUILD_URL,
} = process.env

const DEFAULT_PORT = 3000
const COMMIT_HASH_LENGTH = 10
const DEV_BUILD_ID_LENGTH = 16





module.exports = withWorkers(withSass({
  generateBuildId: () => (
    TEAMCITY
      ? BUILD_VCS_NUMBER.toLowerCase()
      : `DEV_${crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()}`
  ),
  publicRuntimeConfig: {
    local: {
      publicUrl: FRDC_PUBLIC_URL || `http://localhost:${PORT || DEFAULT_PORT}`,
    },
    apis: {
      fuelRats: {
        local: FRDC_PUBLIC_URL ? `${FRDC_PUBLIC_URL}/api` : `http://localhost:${PORT || DEFAULT_PORT}/api`,
        server: FRDC_API_URL || 'http://localhost:8080',
      },
      wordpress: {
        url: FRDC_PUBLIC_URL ? `${FRDC_PUBLIC_URL}/wp-api` : `http://localhost:${PORT || DEFAULT_PORT}/wp-api`,
      },
      stripe: {
        public: FRDC_STRIPE_API_PK || null,
      },
    },
  },
  webpack: (config, data) => {
    config.plugins.push(new webpack.DefinePlugin({
      $IS_DEVELOPMENT: JSON.stringify(data.dev),
      $IS_STAGING: JSON.stringify(['develop', 'beta'].includes(BUILD_VCS_BRANCH)),
      $BUILD_BRANCH: JSON.stringify(BUILD_VCS_BRANCH || 'develop'),
      $BUILD_COMMIT: JSON.stringify(BUILD_VCS_NUMBER),
      $BUILD_COMMIT_SHORT: JSON.stringify((BUILD_VCS_NUMBER && BUILD_VCS_NUMBER.slice(0, COMMIT_HASH_LENGTH)) || BUILD_VCS_BRANCH || 'develop'),
      $BUILD_DATE: JSON.stringify((new Date()).toISOString()),
      $BUILD_URL: JSON.stringify(TEAMCITY_BUILD_URL),
      $NEXT_BUILD_ID: JSON.stringify(data.buildId),
      $NODE_VERSION: JSON.stringify(process.version),
    }))

    if (data.dev) {
      config.module.rules.unshift({
        enforce: 'pre',
        exclude: /node_modules/u,
        loader: 'eslint-loader',
        test: /\.js$/u,
      })
    }

    return config
  },
  sassLoaderOptions: {
    includePaths: ['styles', 'node_modules']
      .map((dir) => path.join(__dirname, dir))
      .map((dir) => glob.sync(dir))
      .reduce((acc, dir) => acc.concat(dir), []),
  },
  workerLoaderOptions: { inline: true },
}))
