/* eslint-disable import/no-extraneous-dependencies */
const importRules = require('@fuelrats/eslint-config/rules/plugin-import')
const importExtensions = require('@fuelrats/eslint-config/util/importExtensions')

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
    'import/order': ['error', {
      ...importRules.rules['import/order'][1],
      'newlines-between': 'always',
    }],
  },
  settings: {
    'import/ignore': [
      '.worker.js$',
    ],
    'import/resolver': {
      node: {
        extensions: importExtensions,
      },
      alias: {
        map: [['~', './src']],
        extensions: importExtensions,
      },
    },
  },
}
