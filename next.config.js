/* eslint-disable import/no-extraneous-dependencies -- required dev dependencies are only loaded in development context */
/* eslint-disable no-param-reassign -- reassign is intended for changing configs */

/* eslint-env node */
const crypto = require('crypto')
const path = require('path')
const { DefinePlugin } = require('webpack')





// Constants
const {
  GITHUB_REF,
  GITHUB_SHA,
  FRDC_API_URL,
  FRDC_PUBLIC_URL,
  FRDC_SOCKET_URL,
  FRDC_STRIPE_API_PK,
  PORT,
  CI,
  GITHUB_SERVER_URL = 'https://github.com',
  GITHUB_RUN_ID,
} = process.env


const DEFAULT_PORT = 3000
const COMMIT_HASH_LENGTH = 10
const DEV_BUILD_ID_LENGTH = 16
const GIT_BRANCH = (GITHUB_REF || 'develop').replace(/^refs\/heads\//u, '').replace(/\//gu, '-')


const FINAL_PUBLIC_URL = FRDC_PUBLIC_URL || `http://localhost:${PORT || DEFAULT_PORT}`


const generateBuildId = () => {
  const buildId = CI
    ? GITHUB_SHA.toLowerCase()
    : crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()

  return `${GIT_BRANCH}_${buildId}`
}


module.exports = {
  distDir: path.join('dist', 'next'),
  generateBuildId,
  images: {
    domains: ['static-cdn.jtvnw.net'],
  },
  publicRuntimeConfig: {
    local: {
      publicUrl: FINAL_PUBLIC_URL,
    },
    apis: {
      fuelRats: {
        local: `${FINAL_PUBLIC_URL}/api/fr`,
        server: FRDC_API_URL || 'http://localhost:8080',
        socket: FRDC_SOCKET_URL || 'wss://localhost:8080',
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
  webpack: (config, opt) => {
    /* Define Plugin */
    config.plugins.push(new DefinePlugin({
      $IS_DEVELOPMENT: JSON.stringify(opt.dev),
      $IS_STAGING: JSON.stringify(['develop', 'beta'].includes(GIT_BRANCH)),
      $BUILD_BRANCH: JSON.stringify(GIT_BRANCH),
      $BUILD_COMMIT: JSON.stringify(GITHUB_SHA || null),
      $BUILD_COMMIT_SHORT: JSON.stringify((GITHUB_SHA && GITHUB_SHA.slice(0, COMMIT_HASH_LENGTH)) || GIT_BRANCH),
      $BUILD_DATE: JSON.stringify((new Date()).toISOString()),
      $BUILD_URL: JSON.stringify(`${GITHUB_SERVER_URL}/fuelrats/fuelrats.com/actions/runs/${GITHUB_RUN_ID}` || null),
      $NEXT_BUILD_ID: JSON.stringify(opt.buildId),
      $NODE_VERSION: JSON.stringify(process.version),
    }))


    /* worker-loader */
    config.module.rules.unshift({
      test: /\.worker\.js$/u,
      loader: require.resolve('worker-loader'),
      options: {
        filename: 'static/[contenthash].worker.js',
        publicPath: '/_next/',
      },
    })
    config.output.globalObject = 'self'


    /* SVGR */
    config.module.rules.push({
      exclude: /node_modules/u,
      test: /\.svg$/u,
      loader: require.resolve('@svgr/webpack'),
    })

    return config
  },
}
