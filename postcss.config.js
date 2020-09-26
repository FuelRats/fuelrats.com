module.exports = {
  plugins: [
    ['postcss-easy-import', { prefix: '_', extensions: ['.css', '.scss'] }],
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
  ],
}
