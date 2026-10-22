const crypto = require('crypto')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const ciEnv = require('./.config/ciEnv')
const env = require('./.config/env')
const headersConfig = require('./.config/headers.config')
const redirectsConfig = require('./.config/redirects.config')
const rewritesConfig = require('./.config/rewrites.config')


// Constants
const DEV_BUILD_ID_LENGTH = 16


// Next may load this config in several processes during one build. Child processes inherit the environment, so caching
// generated values there keeps them consistent across all of them.
const getBuildDate = () => {
  process.env.FR_BUILD_DATE ??= (new Date()).toISOString()

  return process.env.FR_BUILD_DATE
}

const getBuildId = () => {
  process.env.FR_BUILD_ID ??= `${ciEnv.branch}_${ciEnv.isCi
    ? ciEnv.commit
    : crypto.randomBytes(DEV_BUILD_ID_LENGTH).toString('hex').toLowerCase()}`

  return process.env.FR_BUILD_ID
}


module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER

  return {
    distDir: 'dist',

    // Bundle server dependencies instead of loading them through Turbopack's runtime-created aliases, which Bun
    // can't resolve in development (oven-sh/bun#25370)
    bundlePagesRouterDependencies: true,

    experimental: {
      optimizePackageImports: [
        'date-fns',
        'lodash',
        'motion',
      ],
    },

    images: {
      disableStaticImages: true,
      remotePatterns: [
        { protocol: 'https', hostname: 'wordpress.fuelrats.com' },
        { protocol: 'https', hostname: 'static-cdn.jtvnw.net' },
      ],
    },

    compiler: {
      define: {
        '$$BUILD.isDev': isDev,
        '$$BUILD.isProduction': !isDev && ciEnv.branch === 'release',
        '$$BUILD.branch': ciEnv.branch,
        '$$BUILD.commit': ciEnv.commit ?? '',
        '$$BUILD.commitShort': ciEnv.commitShort ?? ciEnv.branch,
        '$$BUILD.date': getBuildDate(),
        '$$BUILD.url': `${ciEnv.server}/${ciEnv.repository}${ciEnv.ciId ? `/actions/runs/${ciEnv.ciId}` : ''}`,
        '$$BUILD.id': getBuildId(),
        '$$BUILD.nodeVersion': process.version,
      },
    },

    turbopack: {
      rules: {
        '*.svg': {
          condition: { not: 'foreign' },
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },

    headers: headersConfig(env),
    redirects: redirectsConfig(env),
    rewrites: rewritesConfig(),

    generateBuildId: getBuildId,

  }
}
