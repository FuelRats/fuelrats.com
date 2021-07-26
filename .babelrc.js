module.exports = {
  presets: [
    [
      require.resolve('next/babel'),
      {
        'preset-env': {
          bugfixes: true,
          targets: 'defaults, not IE 11, not IE_mob 11, node 16',
        },
        'class-properties': {
          loose: true,
        },
      },
    ],
  ],
  plugins: [
    [require.resolve('@fuelrats/babel-plugin-classnames'), { transformObjects: true, packageName: 'clsx' }],
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    require.resolve('@babel/plugin-proposal-export-default-from'),
  ],
}
