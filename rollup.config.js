/* eslint-env node */
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'
import path from 'path'
import externals from 'rollup-plugin-node-externals'





const isDev = process.env.NODE_ENV !== 'production'





const babelConfig = {
  babelrc: false,
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '14',
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




const rollup = {
  input: path.resolve(__dirname, 'src', 'server', 'server.mjs'),
  output: {
    file: path.resolve(__dirname, 'dist', 'server.js'),
    format: 'cjs',
    sourcemap: isDev,
  },
  plugins: [
    externals({
      deps: true,
    }),
    node(),
    commonjs(),
    babel(babelConfig),
  ],
}

export default rollup
