module.exports = {
  default: [
    'build',
    'watch'
  ],

  build: [
    'clean:app',
    'updateLocales',
    'buildCSS'
  ],

  buildCSS: [
    'buildAppCSS',
    'buildLibCSS'
  ],

  buildAppCSS: [
    'copy:fontawesome',
    'sass_globbing',
    'sass:appCSS'
  ],

  buildLibCSS: [
    'sass:libCSS'
  ],

  updateLocales: [
    'clean:locales',
    'copy:locales'
  ],

  dist: [
    'build',
    'cssmin',
    'uglify'
  ]
}
