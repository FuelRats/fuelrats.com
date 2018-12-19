/* eslint-env node */

// Module imports
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const glob = require('glob')
const path = require('path')
const crypto = require('crypto')
const webpack = require('webpack')
const withSass = require('@zeit/next-sass')





// Component constants
const {
  ANALYZE,
  FRDC_API_URL,
  FRDC_PUBLIC_URL,
  FRDC_STRIPE_API_PK,
  PORT,
  TRAVIS,
  TRAVIS_BRANCH,
  TRAVIS_BUILD_ID,
  TRAVIS_COMMIT,
  TRAVIS_COMMIT_RANGE,
} = process.env
const DEFAULT_PORT = 3000
const COMMIT_HASH_LENGTH = 10
const DEV_BUILD_ID_LENGTH = 16





module.exports = withSass({
  generateBuildId: () => (
    TRAVIS
      ? TRAVIS_COMMIT.toLowerCase()
      : `DEV_${crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()}`
  ),
  publicRuntimeConfig: {
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
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
      }))
    }

    config.plugins.push(new webpack.DefinePlugin({
      $IS_DEVELOPMENT: JSON.stringify(data.dev),
      $IS_STAGING: JSON.stringify(['develop', 'beta'].includes(TRAVIS_BRANCH)),
      $BUILD_BRANCH: JSON.stringify(TRAVIS_BRANCH || 'develop'),
      $BUILD_COMMIT: JSON.stringify((TRAVIS_COMMIT && TRAVIS_COMMIT.slice(0, COMMIT_HASH_LENGTH)) || TRAVIS_BRANCH || 'develop'),
      $BUILD_COMMIT_HASH: JSON.stringify(TRAVIS_COMMIT),
      $BUILD_COMMIT_RANGE: JSON.stringify(TRAVIS_COMMIT_RANGE),
      $BUILD_DATE: JSON.stringify((new Date()).toISOString()),
      $BUILD_ID: JSON.stringify(TRAVIS_BUILD_ID),
      $NEXT_BUILD_ID: JSON.stringify(data.buildId),
      $NODE_VERSION: JSON.stringify(process.version),
    }))

    config.module.rules.unshift({
      enforce: 'pre',
      exclude: /node_modules/u,
      loader: 'eslint-loader',
      test: /\.js$/u,
    })

    return config
  },
  sassLoaderOptions: {
    includePaths: ['styles', 'node_modules']
      .map((dir) => path.join(__dirname, dir))
      .map((dir) => glob.sync(dir))
      .reduce((acc, dir) => acc.concat(dir), []),
  },
})
