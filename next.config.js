const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const withSass = require('@zeit/next-sass')

const { ANALYZE } = process.env
const path = require('path')
const glob = require('glob')

const {
  FRDC_API_URL,
  FRDC_LOCAL_API_URL,
} = process.env

module.exports = withSass({
  publicRuntimeConfig: {
    apis: {
      fuelRats: {
        client: FRDC_LOCAL_API_URL || '/api',
        server: FRDC_API_URL || 'http://localhost:8080',
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
