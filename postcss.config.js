/* eslint-disable global-require */
module.exports = {
  plugins: [
    require('postcss-easy-import')({ prefix: '_' }), // inline @imports
    require('autoprefixer')({}), // so imports are auto-prefixed too
  ],
}
