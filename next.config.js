/* eslint-disable import/no-extraneous-dependencies -- required dev dependencies are only loaded in development context */
/* eslint-disable no-param-reassign -- reassign is intended for changing configs */

/* eslint-env node */
import crypto from 'crypto'
import path from 'path'
import url from 'url'
import { DefinePlugin } from 'webpack'

import redirects from './.next/redirects'
import rewrites from './.next/rewrites'
import getEnv from './src/util/server/getEnv'



// Constants
const env = getEnv()


const {
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

const next = {
  distDir: path.join('dist', 'next'),
  generateBuildId,
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
  publicRuntimeConfig: {
    // This information is PUBLIC. all env values are explicitly defined to prevent secret leakage.
    // DO NOT BLINDLY DEFINE OBJECTS! I.E. `frapi: env.frapi,`
    appUrl: env.appUrl,
    frapi: {
      url: env.frapi.proxy,
      server: env.frapi.url,
      socket: env.frapi.socket,
    },
    edsm: {
      url: env.edsm.proxy,
    },
    wordpress: {
      url: env.wordpress.proxy,
    },
    stripe: {
      url: env.stripe.url,
      public: env.stripe.public,
    },
    irc: {
      client: env.irc.client,
      rat: env.irc.rat,
    },
  },
  redirects: redirects(env),
  rewrites: rewrites(env),
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

    /* SVGR */
    config.module.rules.push({
      exclude: /node_modules/u,
      test: /\.svg$/u,
      loader: require.resolve('@svgr/webpack'),
    })

    return config
  },
}



export default next
