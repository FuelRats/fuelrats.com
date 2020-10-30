/* eslint-disable import/no-extraneous-dependencies */
const importRules = require('@fuelrats/eslint-config/core/plugin-import')
const styleRules = require('@fuelrats/eslint-config/core/style')
const importExtensions = require('@fuelrats/eslint-config/util/importExtensions')

module.exports = {
  env: {
    browser: true,
    commonjs: true,
  },
  extends: [
    '@fuelrats/eslint-config',
    '@fuelrats/eslint-config/plugins/fuelrats',
    '@fuelrats/eslint-config-react',
  ],
  rules: {
    'id-length': ['error', {
      ...styleRules.rules['id-length'][1],
      exceptions: [
        '_', // unused func param
        'x', // framer-motion x pos
        'y', // framer-motion y pos
      ],
    }],
    'jsx-a11y/no-noninteractive-element-interactions': ['off'], // We intend to enable this once we refactor certain key components.
    'jsdoc/require-jsdoc': ['off'], // we'll get to it someday...
    'react/jsx-uses-react': ['off'],
    'react/react-in-jsx-scope': ['off'],
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
