module.exports = {
  appCSS: {
    options: {
      style: 'expanded'
    },

    files: {
      'static/compiled/app.css': 'scss/app.scss'
    }
  },

  libCSS: {
    options: {
      style: 'expanded'
    },

    files: {
      'static/compiled/lib.css': 'scss/lib.scss'
    }
  }
}
