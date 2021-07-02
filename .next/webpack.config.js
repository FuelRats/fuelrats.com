/* eslint-disable import/no-extraneous-dependencies -- required dev dependencies are only loaded in development context */
/* eslint-disable no-param-reassign -- reassign is intended for changing configs */
/* eslint-env node */
const { DefinePlugin } = require('webpack')





module.exports = (env) => {
  return (config, opt) => {
    /* Define Plugin */
    config.plugins.push(new DefinePlugin({
      '$$BUILD.isDev': JSON.stringify(opt.dev),
      '$$BUILD.isProduction': JSON.stringify(!opt.dev && env.git.branch === 'release'),
      '$$BUILD.branch': JSON.stringify(env.git.branch ?? null),
      '$$BUILD.commit': JSON.stringify(env.git.commit ?? null),
      '$$BUILD.commitShort': JSON.stringify(env.git.commitShort ?? env.git.branch),
      '$$BUILD.date': JSON.stringify((new Date()).toISOString()),
      '$$BUILD.url': JSON.stringify(`${env.git.server}/fuelrats/fuelrats.com/actions/runs/${env.git.ciId}`),
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
