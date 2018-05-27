const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const withSass = require('@zeit/next-sass')

const { ANALYZE } = process.env
const path = require('path')
const glob = require('glob')

const {
  FRDC_API_URL,
  FRDC_PUBLIC_URL,
  PORT,
  TRAVIS_BRANCH,
  TRAVIS_COMMIT,
  TRAVIS_COMMIT_RANGE,
} = process.env

module.exports = withSass({
  publicRuntimeConfig: {
    apis: {
      fuelRats: {
        local: `${FRDC_PUBLIC_URL}/api` || `http://localhost:${PORT || 3000}/api`,
        server: FRDC_API_URL || 'http://localhost:8080',
      },
      wordpress: {
        url: `${FRDC_PUBLIC_URL}/wp-api` || `http://localhost:${PORT || 3000}/wp-api`,
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

    if (!dev) {
      config.plugins.push(new UglifyJsPlugin())
    }

    config.plugins.push(new webpack.DefinePlugin({
      IS_DEVELOPMENT: JSON.stringify(dev),
      IS_STAGING: JSON.stringify(['develop', 'beta'].includes(TRAVIS_BRANCH)),
      BUILD_COMMIT: JSON.stringify((TRAVIS_COMMIT && TRAVIS_COMMIT.slice(0, 10)) || TRAVIS_BRANCH || 'Development'),
      BUILD_COMMIT_RANGE: JSON.stringify(TRAVIS_COMMIT_RANGE),
    }))

    config.module.rules.unshift({
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader',
      test: /\.js$/,
    })

    return config
  },
  sassLoaderOptions: {
    includePaths: ['styles', 'node_modules']
      .map((d) => path.join(__dirname, d))
      .map((g) => glob.sync(g))
      .reduce((a, c) => a.concat(c), []),
  },
})
