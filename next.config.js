/* eslint-disable import/no-extraneous-dependencies -- required dev dependencies are only loaded in development context */
/* eslint-disable no-param-reassign -- reassign is intended for changing configs */

/* eslint-env node */
const crypto = require('crypto')
const path = require('path')
const url = require('url')
const { DefinePlugin } = require('webpack')





// Constants
const {
  APP_URL,
  FR_API_URL,
  FR_CLIENT_IRC_URL,
  FR_RAT_IRC_URL,
  FR_SOCKET_URL,
  FR_STRIPE_API_PK,
  GITHUB_REF,
  GITHUB_RUN_ID,
  GITHUB_SERVER_URL = 'https://github.com',
  GITHUB_SHA,
  CI,
} = process.env

const COMMIT_HASH_LENGTH = 10
const DEV_BUILD_ID_LENGTH = 16
const GIT_BRANCH = (GITHUB_REF || 'develop').replace(/^refs\/heads\//u, '').replace(/\//gu, '-')

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
    domains: [
      url.parse(APP_URL).hostname, // Ensure the public hostname is always allowed.
      'static-cdn.jtvnw.net',
    ],
  },
  publicRuntimeConfig: {
    appUrl: APP_URL,
    irc: {
      client: FR_CLIENT_IRC_URL ?? 'https://qms.fuelrats.dev',
      rat: FR_RAT_IRC_URL ?? 'https://kiwi.fuelrats.com',
    },
    apis: {
      fuelRats: {
        url: `${APP_URL}/api/fr`,
        server: FR_API_URL ?? 'https://dev.api.fuelrats.com',
        socket: FR_SOCKET_URL ?? 'wss://dev.api.fuelrats.com',
      },
      wordpress: {
        url: `${APP_URL}/api/wp`,
      },
      stripe: {
        url: `${APP_URL}/api/stripe`,
        public: FR_STRIPE_API_PK,
      },
    },
  },
  future: {
    webpack5: true,
  },
  redirects: () => {
    return [
      {
        source: '/donate/cancel',
        destination: '/donate',
        permanent: false,
      },
    ]
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

    // Workaround to fix dev warning: https://github.com/vercel/next.js/issues/19865
    config.output.hotUpdateMainFilename = 'static/webpack/[fullhash].[runtime].hot-update.json'

    // Workaround to fix production builds with workers: https://github.com/vercel/next.js/issues/22813
    config.output.chunkFilename = opt.isServer
      ? `${opt.dev ? '[name]' : '[name].[fullhash]'}.js`
      : `static/chunks/${opt.dev ? '[name]' : '[name].[fullhash]'}.js`

    /* SVGR */
    config.module.rules.push({
      exclude: /node_modules/u,
      test: /\.svg$/u,
      loader: require.resolve('@svgr/webpack'),
    })

    return config
  },
}
