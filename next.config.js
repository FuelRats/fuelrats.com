/* eslint-env node */
// Module imports
const withWorkers = require('@zeit/next-workers')
const crypto = require('crypto')
const path = require('path')
const webpack = require('webpack')





// Component constants
const {
  GITHUB_REF,
  GITHUB_SHA,
  FRDC_API_URL,
  FRDC_PUBLIC_URL,
  FRDC_STRIPE_API_PK,
  PORT,
  CI,
  GITHUB_SERVER_URL,
  GITHUB_RUN_ID,
} = process.env


const DEFAULT_PORT = 3000
const COMMIT_HASH_LENGTH = 10
const DEV_BUILD_ID_LENGTH = 16
const GIT_BRANCH = (GITHUB_REF || 'develop').replace(/^refs\/heads\//u, '')


const FINAL_PUBLIC_URL = FRDC_PUBLIC_URL || `http://localhost:${PORT || DEFAULT_PORT}`


const generateBuildId = () => {
  const buildId = CI
    ? GITHUB_SHA.toLowerCase()
    : crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()

  return `${GIT_BRANCH}_${buildId}`
}


module.exports = withWorkers({
  distDir: path.join('dist', 'next'),
  generateBuildId,
  publicRuntimeConfig: {
    local: {
      publicUrl: FINAL_PUBLIC_URL,
    },
    apis: {
      fuelRats: {
        local: `${FINAL_PUBLIC_URL}/api`,
        server: FRDC_API_URL || 'http://localhost:8080',
      },
      wordpress: {
        url: `${FINAL_PUBLIC_URL}/wp-api`,
      },
      stripe: {
        url: `${FINAL_PUBLIC_URL}/st-api`,
        public: FRDC_STRIPE_API_PK || null,
      },
    },
  },
  webpack: (config, options) => {
    /* Define Plugin */
    config.plugins.push(new webpack.DefinePlugin({
      $IS_DEVELOPMENT: JSON.stringify(options.dev),
      $IS_STAGING: JSON.stringify(['develop', 'beta'].includes(GIT_BRANCH)),
      $BUILD_BRANCH: JSON.stringify(GIT_BRANCH),
      $BUILD_COMMIT: JSON.stringify(GITHUB_SHA || null),
      $BUILD_COMMIT_SHORT: JSON.stringify((GITHUB_SHA && GITHUB_SHA.slice(0, COMMIT_HASH_LENGTH)) || GIT_BRANCH),
      $BUILD_DATE: JSON.stringify((new Date()).toISOString()),
      $BUILD_URL: JSON.stringify(`${GITHUB_SERVER_URL}/fuelrats/fuelrats.com/actions/runs/${GITHUB_RUN_ID}` || null),
      $NEXT_BUILD_ID: JSON.stringify(options.buildId),
      $NODE_VERSION: JSON.stringify(process.version),
    }))

    config.module.rules.push({
      exclude: /node_modules/u,
      test: /\.svg$/u,
      loader: '@svgr/webpack',
    })

    /* ESLint reporting */
    if (options.dev) {
      config.module.rules.unshift({
        test: /\.js$/u,
        exclude: /node_modules/u,
        enforce: 'pre',
        loader: require.resolve('eslint-loader'),
      })
    }

    return config
  },
  workerLoaderOptions: { inline: true },
})
