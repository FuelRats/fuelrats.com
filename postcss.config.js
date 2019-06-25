/* eslint-disable global-require */
module.exports = {
  plugins: [
    require('postcss-easy-import')({
      prefix: '_',
      plugins: ([
        require('stylelint')({}), // lint before merge.
      ]),
    }), // inline @imports
    require('autoprefixer')({}), // so imports are auto-prefixed too
  ],
}
