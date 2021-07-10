/* eslint-disable import/no-extraneous-dependencies -- required dev dependencies are only loaded in development context */
/* eslint-disable no-param-reassign -- reassign is intended for changing configs */
const { DefinePlugin } = require('webpack')

const ciEnv = require('./ciEnv')





module.exports = () => {
  return (config, opt) => {
    /* Define Plugin */
    config.plugins.push(new DefinePlugin({
      '$$BUILD.isDev': JSON.stringify(opt.dev),
      '$$BUILD.isProduction': JSON.stringify(!opt.dev && ciEnv.branch === 'release'),
      '$$BUILD.branch': JSON.stringify(ciEnv.branch ?? null),
      '$$BUILD.commit': JSON.stringify(ciEnv.commit ?? null),
      '$$BUILD.commitShort': JSON.stringify(ciEnv.commitShort ?? ciEnv.branch),
      '$$BUILD.date': JSON.stringify((new Date()).toISOString()),
      '$$BUILD.url': JSON.stringify(`${ciEnv.server}/${ciEnv.repository}${ciEnv.ciId ? `/actions/runs/${ciEnv.ciId}` : ''}`),
      '$$BUILD.id': JSON.stringify(opt.buildId),
      '$$BUILD.nodeVersion': JSON.stringify(process.version),
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
  }
}
