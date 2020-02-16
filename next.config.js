/* eslint-env node */





// Module imports
const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
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


const FINAL_PUBLIC_URL = FRDC_PUBLIC_URL || `http://localhost:${PORT || DEFAULT_PORT}`


const generateBuildId = () => {
  return (
    TEAMCITY
      ? BUILD_VCS_NUMBER.toLowerCase()
      : `DEV_${crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()}`
  )
}

const expandPaths = (paths) => {
  return paths.reduce((acc, dir) => {
    return acc.concat(
      glob.sync(path.join(__dirname, dir)),
    )
  }, [])
}



module.exports = withWorkers({
  distDir: 'dist',
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
      $IS_STAGING: JSON.stringify(['develop', 'beta'].includes(BUILD_VCS_BRANCH)),
      $BUILD_BRANCH: JSON.stringify(BUILD_VCS_BRANCH || 'develop'),
      $BUILD_COMMIT: JSON.stringify(BUILD_VCS_NUMBER || null),
      $BUILD_COMMIT_SHORT: JSON.stringify((BUILD_VCS_NUMBER && BUILD_VCS_NUMBER.slice(0, COMMIT_HASH_LENGTH)) || BUILD_VCS_BRANCH || 'develop'),
      $BUILD_DATE: JSON.stringify((new Date()).toISOString()),
      $BUILD_URL: JSON.stringify(TEAMCITY_BUILD_URL || null),
      $NEXT_BUILD_ID: JSON.stringify(options.buildId),
      $NODE_VERSION: JSON.stringify(process.version),
    }))

    /* Sass loading */
    const sassLoaderConfig = cssLoaderConfig(
      config,
      {
        extensions: ['scss', 'sass'],
        dev: options.dev,
        isServer: options.isServer,
        loaders: [
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: expandPaths(['styles', 'node_modules']),
              },
            },
          },
        ],
      },
    )

    config.module.rules.push(
      { test: /\.scss$/u, use: sassLoaderConfig },
      { test: /\.sass$/u, use: sassLoaderConfig },
    )


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
