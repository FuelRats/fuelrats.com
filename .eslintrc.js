const util = require('@fuelrats/eslint-config-react/util')
const { withAliasResolver } = require('@fuelrats/eslint-config/util/import')

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
    fetch: 'readonly',
  },
  rules: {
    'import/order': util.extendRule('import/order', {
      'newlines-between': 'always',
    }),
    ...util.disable(
      'jsx-a11y/no-noninteractive-element-interactions', // We intend to enable this once we refactor certain key components.
      'jsdoc/require-jsdoc', // we'll get to it someday...
      '@next/next/link-passhref', // This rule is broken so just ignore it for now.
    ),
  },
  settings: {
    'import/ignore': [
      '.worker.js$',
    ],
    'import/resolver': withAliasResolver([
      ['~', './src'],
      ['typings', './typings']
    ]),
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
