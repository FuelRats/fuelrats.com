/* eslint-env node */

// Module imports
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const withSass = require('@zeit/next-sass')

const {
  ANALYZE,
  FRDC_API_URL,
  FRDC_PUBLIC_URL,
  FRDC_STRIPE_API_PK,
  PORT,
  TRAVIS_BRANCH,
  TRAVIS_COMMIT,
  TRAVIS_COMMIT_RANGE,
} = process.env


const DEFAULT_PORT = 3000
const COMMIT_HASH_LENGTH = 10

module.exports = withSass({
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
  webpack: (config, { dev }) => {
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
      }))
    }

    config.plugins.push(new webpack.DefinePlugin({
      IS_DEVELOPMENT: JSON.stringify(dev),
      IS_STAGING: JSON.stringify(['develop', 'beta'].includes(TRAVIS_BRANCH)),
      BUILD_COMMIT: JSON.stringify((TRAVIS_COMMIT && TRAVIS_COMMIT.slice(0, COMMIT_HASH_LENGTH)) || TRAVIS_BRANCH || 'Development'),
      BUILD_COMMIT_RANGE: JSON.stringify(TRAVIS_COMMIT_RANGE),
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
      .map(dir => path.join(__dirname, dir))
      .map(dir => glob.sync(dir))
      .reduce((acc, dir) => acc.concat(dir), []),
  },
})
