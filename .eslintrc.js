const importRules = require('@fuelrats/eslint-config/core/plugin-import')
const jsExtensions = require('@fuelrats/eslint-config/util/importExtensions')
const tsExtensions = require('@fuelrats/eslint-config/util/importExtensionsTypescript')

module.exports = {
  env: {
    browser: true,
    commonjs: true,
  },
  extends: [
    '@fuelrats/eslint-config',
    '@fuelrats/eslint-config/plugin/fuelrats',
    '@fuelrats/eslint-config-react',
    'plugin:@next/next/recommended',
  ],
  globals: {
    $$BUILD: 'readonly',
  },
  rules: {
    'jsx-a11y/no-noninteractive-element-interactions': ['off'], // We intend to enable this once we refactor certain key components.
    'jsdoc/require-jsdoc': ['off'], // we'll get to it someday...
    'import/order': ['error', {
      ...importRules.rules['import/order'][1],
      'newlines-between': 'always',
    }],
    '@next/next/link-passhref': ['off'], // This rule is broken so just ignore it for now.
  },
  settings: {
    'import/ignore': [
      '.worker.js$',
    ],
    'import/resolver': {
      node: {
        extensions: jsExtensions,
      },
      alias: {
        map: [['~', './src'], ['typings', './typings']],
        extensions: tsExtensions,
      },
    },
  },
  overrides: [
    {
      files: [
        '.config/**/*.js',
        'src/pages/api/**/*.js',
        'src/util/server/**/*.js',
      ],
      env: {
        browser: false,
        node: true,
      },
    },
    {
      files: ['*.worker.js'],
      env: {
        browser: false,
        commonjs: false,
        worker: true,
      },
    },
    {
      files: ['src/pages/**/*.js'],
      rules: {
        '@fuelrats/default-export-matches-module-name': ['off'], // Disabled in pages dir as it becomes difficult to stick to module names
      },
    },
  ],
}
