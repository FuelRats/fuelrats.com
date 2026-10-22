const babelParser = require('@babel/eslint-parser')
const { default: babelPlugin } = require('@babel/eslint-plugin')
const { fixupPluginRules } = require('@eslint/compat')
const nextPlugin = require('@next/eslint-plugin-next')
const stylisticPlugin = require('@stylistic/eslint-plugin')
const importPlugin = require('eslint-plugin-import-x')
const jsdocPlugin = require('eslint-plugin-jsdoc')
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const globals = require('globals')

const babelRules = require('./.config/eslint/rules/babel')
const coreRules = require('./.config/eslint/rules/core')
const importRules = require('./.config/eslint/rules/import')
const jsdocRules = require('./.config/eslint/rules/jsdoc')
const jsxA11yRules = require('./.config/eslint/rules/jsx-a11y')
const nextRules = require('./.config/eslint/rules/next')
const reactRules = require('./.config/eslint/rules/react')
const reactHooksRules = require('./.config/eslint/rules/react-hooks')
const stylisticRules = require('./.config/eslint/rules/stylistic')


module.exports = [
  {
    ignores: [
      '.github/',
      '.vscode/blueprints/',
      '.yarn/',
      'deploy_dist/',
      'dist/',
      'docs/',
      'public/',
      'scripts/',
    ],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [
            '@babel/plugin-syntax-jsx',
            ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
          ],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2020,
        $$BUILD: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
    plugins: {
      '@babel': babelPlugin,
      '@next/next': nextPlugin,
      '@stylistic': stylisticPlugin,
      import: importPlugin,
      jsdoc: jsdocPlugin,
      'jsx-a11y': fixupPluginRules(jsxA11yPlugin),
      react: fixupPluginRules(reactPlugin),
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      'import-x/extensions': ['.js', '.jsx', '.mjs', '.cjs', '.json'],
      'import-x/ignore': ['.worker.js$'],
      'import-x/resolver': {
        [require.resolve('./.config/eslint-import-resolver')]: {
          map: [['~', './src']],
        },
      },
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
    rules: {
      ...coreRules,
      ...stylisticRules,
      ...babelRules,
      ...importRules,
      ...jsdocRules,
      ...reactRules,
      ...reactHooksRules,
      ...jsxA11yRules,
      ...nextRules,
    },
  },
  {
    files: [
      '*.config.js',
      '.config/**/*.js',
      'src/pages/api/**/*.js',
      'src/proxy.js',
      'src/util/server/**/*.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2020,
        $$BUILD: 'readonly',
      },
    },
  },
  {
    files: ['**/*.worker.js'],
    languageOptions: {
      globals: {
        ...globals.worker,
        ...globals.es2020,
        $$BUILD: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
      },
    },
  },
]
