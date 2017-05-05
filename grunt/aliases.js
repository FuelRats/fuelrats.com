module.exports = {
  default: [
    'build',
    'watch'
  ],

  build: [
    'clean:app',
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

  dist: [
    'build',
    'cssmin',
    'uglify'
  ]
}
