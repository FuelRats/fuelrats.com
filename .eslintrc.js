module.exports = {
  env: {
    browser: true,
    commonjs: true,
  },
  extends: [
    '@fuelrats/eslint-config',
    '@fuelrats/eslint-config-react',
  ],
  rules: {
    'jsx-a11y/no-noninteractive-element-interactions': ['off'], // We intend to enable this once we refactor certain key components.
    'react/prop-types': ['off'], // We're not quite ready to enforce prop-types for all files yet.
    'jsdoc/require-jsdoc': ['off'], // we'll get to it someday...
  },
  settings: {
    'import/ignore': [
      '.worker.js$',
    ],
    'import/resolver': {
      alias: {
        map: [
          ['~', './src'],
        ],
        extensions: ['.js'],
      },
    },
  },
}
