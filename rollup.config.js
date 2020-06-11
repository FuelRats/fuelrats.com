/* eslint-env node */
import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
import autoExternal from 'rollup-plugin-auto-external'
import babel from 'rollup-plugin-babel'

const isDev = process.env.NODE_ENV !== 'production'

const babelConfig = {
  babelrc: false,
  externalHelpers: true,
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '13',
        },
        bugfixes: true,
        shippedProposals: true,
        loose: true,
      },
    ],
  ],
  env: {
    development: {
      sourceMaps: true,
    },
    production: {
      sourceMaps: false,
    },
  },
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-class-properties', { loose: true }],
    '@babel/proposal-export-default-from',
    '@babel/proposal-export-namespace-from',
    '@babel/proposal-function-bind',
    '@babel/proposal-function-sent',
    '@babel/proposal-logical-assignment-operators',
    '@babel/proposal-numeric-separator',
    '@babel/proposal-optional-catch-binding',
    '@babel/proposal-throw-expressions',
    '@babel/transform-strict-mode',
  ],
}




const config = {
  input: path.resolve(__dirname, 'src', 'server', 'server.mjs'),
  output: {
    file: path.resolve(__dirname, 'dist', 'server.mjs'),
    format: 'esm',
    sourcemap: isDev,
  },
  plugins: [autoExternal(), resolve(), babel(babelConfig)],
}

export default config
